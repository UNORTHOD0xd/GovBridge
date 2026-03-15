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

    @GetMapping("/by-parish")
    public Map<String, Integer> byParish() {
        return Map.ofEntries(
            Map.entry("Kingston", 45),
            Map.entry("St. Andrew", 38),
            Map.entry("St. Thomas", 12),
            Map.entry("Portland", 9),
            Map.entry("St. Mary", 15),
            Map.entry("St. Ann", 22),
            Map.entry("Trelawny", 8),
            Map.entry("St. James", 32),
            Map.entry("Hanover", 6),
            Map.entry("Westmoreland", 14),
            Map.entry("St. Elizabeth", 11),
            Map.entry("Manchester", 19),
            Map.entry("Clarendon", 17),
            Map.entry("St. Catherine", 28)
        );
    }
}
