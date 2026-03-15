package com.govbridge.kafka;

import com.govbridge.model.ServiceRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Map;

@Service
public class EventProducer {

    private final KafkaTemplate<String, Object> kafka;

    public EventProducer(KafkaTemplate<String, Object> kafka) {
        this.kafka = kafka;
    }

    public void sendServiceStatus(ServiceRequest request) {
        try {
            kafka.send("service-status", request.getId().toString(), Map.of(
                "type", "service-status",
                "requestId", request.getId().toString(),
                "status", request.getStatus().name(),
                "agency", request.getAgency(),
                "serviceType", request.getServiceType().name(),
                "timestamp", OffsetDateTime.now().toString()
            ));
        } catch (Exception e) {
            System.err.println("Kafka unavailable, skipping service-status event: " + e.getMessage());
        }
    }

    public void sendPaymentEvent(String requestId, long amount, String txHash, String receiptId) {
        try {
            kafka.send("payment-events", requestId, Map.of(
                "type", "payment-events",
                "requestId", requestId,
                "status", "confirmed",
                "amount", amount,
                "txHash", txHash != null ? txHash : "",
                "receiptId", receiptId != null ? receiptId : "",
                "timestamp", OffsetDateTime.now().toString()
            ));
        } catch (Exception e) {
            System.err.println("Kafka unavailable, skipping payment event: " + e.getMessage());
        }
    }

    public void sendChainEvent(String action, String txHash) {
        try {
            kafka.send("chain-events", txHash, Map.of(
                "type", "chain-events",
                "action", action,
                "txHash", txHash,
                "timestamp", OffsetDateTime.now().toString()
            ));
        } catch (Exception e) {
            System.err.println("Kafka unavailable, skipping chain event: " + e.getMessage());
        }
    }
}
