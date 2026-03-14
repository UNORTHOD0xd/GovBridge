package com.govbridge.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return Map.of(
            "totalDocuments", 47,
            "totalPayments", 156,
            "avgProcessingMinutes", 3.2,
            "totalVolume", 580000,
            "byAgency", Map.of("TAJ", 89, "RGD", 42, "JCF", 25)
        );
    }
}
