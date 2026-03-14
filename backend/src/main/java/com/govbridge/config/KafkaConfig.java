package com.govbridge.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic serviceStatusTopic() {
        return TopicBuilder.name("service-status").partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic paymentEventsTopic() {
        return TopicBuilder.name("payment-events").partitions(1).replicas(1).build();
    }

    @Bean
    public NewTopic chainEventsTopic() {
        return TopicBuilder.name("chain-events").partitions(1).replicas(1).build();
    }
}
