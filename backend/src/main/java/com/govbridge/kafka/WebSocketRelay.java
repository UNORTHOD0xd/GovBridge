package com.govbridge.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class WebSocketRelay {

    private final SimpMessagingTemplate messaging;

    public WebSocketRelay(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    @KafkaListener(topics = {"service-status", "payment-events", "chain-events"})
    public void relay(Map<String, Object> event) {
        messaging.convertAndSend("/topic/events", event);
    }
}
