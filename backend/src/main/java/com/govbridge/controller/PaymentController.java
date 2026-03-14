package com.govbridge.controller;

import com.govbridge.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/{requestId}")
    public ResponseEntity<?> pay(@PathVariable UUID requestId,
                                  @RequestHeader("X-Citizen-Id") String citizenId) {
        var response = paymentService.processPayment(requestId, UUID.fromString(citizenId));
        return ResponseEntity.ok(response);
    }
}
