package com.govbridge.controller;

import com.govbridge.dto.CreateRequestDto;
import com.govbridge.service.RequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final RequestService requestService;

    public ServiceRequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateRequestDto dto,
                                     @RequestHeader("X-Citizen-Id") String citizenId) {
        var request = requestService.create(UUID.fromString(citizenId), dto.getServiceType());
        return ResponseEntity.ok(request);
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestHeader("X-Citizen-Id") String citizenId) {
        return ResponseEntity.ok(
            requestService.listForCitizen(UUID.fromString(citizenId))
        );
    }

    @PostMapping("/{id}/process")
    public ResponseEntity<?> process(@PathVariable UUID id) {
        requestService.advanceStatus(id);
        return ResponseEntity.ok().build();
    }
}
