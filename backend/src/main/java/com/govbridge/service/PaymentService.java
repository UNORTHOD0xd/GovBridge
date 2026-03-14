package com.govbridge.service;

import com.govbridge.dto.PaymentResponseDto;
import com.govbridge.kafka.EventProducer;
import com.govbridge.model.Payment;
import com.govbridge.repository.CitizenRepository;
import com.govbridge.repository.PaymentRepository;
import com.govbridge.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepo;
    private final ServiceRequestRepository requestRepo;
    private final CitizenRepository citizenRepo;
    private final ChainService chainService;
    private final EventProducer eventProducer;

    public PaymentService(PaymentRepository paymentRepo, ServiceRequestRepository requestRepo,
                          CitizenRepository citizenRepo, ChainService chainService,
                          EventProducer eventProducer) {
        this.paymentRepo = paymentRepo;
        this.requestRepo = requestRepo;
        this.citizenRepo = citizenRepo;
        this.chainService = chainService;
        this.eventProducer = eventProducer;
    }

    @Transactional
    public PaymentResponseDto processPayment(UUID requestId, UUID citizenId) {
        var request = requestRepo.findById(requestId).orElseThrow();
        var citizen = citizenRepo.findById(citizenId).orElseThrow();

        long fee = request.getFeeAmount();
        if (citizen.getJamdexBalance() < fee) {
            throw new RuntimeException("Insufficient Jam-Dex balance");
        }
        citizen.setJamdexBalance(citizen.getJamdexBalance() - fee);
        citizenRepo.save(citizen);

        String ninHash = citizen.getNinHash();
        String txHash = null;
        String receiptId = null;
        try {
            var result = chainService.recordPayment(
                ninHash, fee, request.getAgency(), request.getServiceType().name()
            );
            txHash = result.txHash();
            receiptId = result.receiptId();
        } catch (Exception e) {
            System.err.println("On-chain payment recording failed: " + e.getMessage());
        }

        var payment = new Payment();
        payment.setRequestId(requestId);
        payment.setCitizenId(citizenId);
        payment.setAmount(fee);
        payment.setReceiptId(receiptId);
        payment.setChainTxHash(txHash);
        paymentRepo.save(payment);

        eventProducer.sendPaymentEvent(requestId.toString(), fee, txHash, receiptId);

        return new PaymentResponseDto(
            payment.getId(), "confirmed", receiptId, txHash,
            citizen.getJamdexBalance()
        );
    }
}
