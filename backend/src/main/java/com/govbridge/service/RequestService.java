package com.govbridge.service;

import com.govbridge.kafka.EventProducer;
import com.govbridge.model.*;
import com.govbridge.repository.DocumentRepository;
import com.govbridge.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class RequestService {

    private final ServiceRequestRepository requestRepo;
    private final DocumentRepository documentRepo;
    private final EventProducer eventProducer;
    private final ChainService chainService;

    public RequestService(ServiceRequestRepository requestRepo, DocumentRepository documentRepo,
                          EventProducer eventProducer, ChainService chainService) {
        this.requestRepo = requestRepo;
        this.documentRepo = documentRepo;
        this.eventProducer = eventProducer;
        this.chainService = chainService;
    }

    private static final Map<ServiceType, Long> FEES = Map.of(
        ServiceType.tax_compliance, 5000L,
        ServiceType.birth_cert, 3000L,
        ServiceType.police_record, 2500L
    );

    private static final Map<ServiceType, String> AGENCIES = Map.of(
        ServiceType.tax_compliance, "TAJ",
        ServiceType.birth_cert, "RGD",
        ServiceType.police_record, "JCF"
    );

    public ServiceRequest create(UUID citizenId, ServiceType serviceType) {
        var request = new ServiceRequest();
        request.setCitizenId(citizenId);
        request.setServiceType(serviceType);
        request.setAgency(AGENCIES.get(serviceType));
        request.setFeeAmount(FEES.getOrDefault(serviceType, 0L));
        request.setStatus(ServiceStatus.submitted);
        request = requestRepo.save(request);

        eventProducer.sendServiceStatus(request);
        return request;
    }

    public void advanceStatus(UUID requestId) {
        var request = requestRepo.findById(requestId).orElseThrow();
        var next = nextStatus(request.getStatus());
        if (next == null) return;

        request.setStatus(next);
        request.setUpdatedAt(OffsetDateTime.now());
        requestRepo.save(request);

        eventProducer.sendServiceStatus(request);

        if (next == ServiceStatus.issued) {
            anchorDocument(request);
        }
    }

    private void anchorDocument(ServiceRequest request) {
        String content = String.format(
            "{\"type\":\"%s\",\"agency\":\"%s\",\"citizen\":\"%s\",\"issued\":\"%s\"}",
            request.getServiceType(), request.getAgency(),
            request.getCitizenId(), OffsetDateTime.now()
        );
        String docHash = sha256Hex(content);
        String cleanId = request.getCitizenId().toString().replace("-", "");
        String ninHash = sha256Hex(cleanId);

        try {
            String txHash = chainService.anchorDocument(
                docHash, ninHash, request.getAgency(), request.getServiceType().name()
            );
            request.setDocHash(docHash);
            request.setChainTxHash(txHash);
            requestRepo.save(request);

            var doc = new Document();
            doc.setRequestId(request.getId());
            doc.setCitizenId(request.getCitizenId());
            doc.setDocHash(docHash);
            doc.setDocType(request.getServiceType());
            doc.setAgency(request.getAgency());
            doc.setChainTxHash(txHash);
            documentRepo.save(doc);

            eventProducer.sendChainEvent("document_anchored", txHash);
        } catch (Exception e) {
            System.err.println("Chain anchoring failed: " + e.getMessage());
        }
    }

    private ServiceStatus nextStatus(ServiceStatus current) {
        return switch (current) {
            case submitted -> ServiceStatus.processing;
            case processing -> ServiceStatus.approved;
            case approved -> ServiceStatus.issued;
            default -> null;
        };
    }

    public List<ServiceRequest> listForCitizen(UUID citizenId) {
        return requestRepo.findByCitizenIdOrderByCreatedAtDesc(citizenId);
    }

    private static String sha256Hex(String input) {
        try {
            var digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            var sb = new StringBuilder("0x");
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
