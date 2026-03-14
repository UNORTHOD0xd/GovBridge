package com.govbridge.controller;

import com.govbridge.repository.DocumentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/verify")
public class VerificationController {

    private final DocumentRepository documentRepo;

    public VerificationController(DocumentRepository documentRepo) {
        this.documentRepo = documentRepo;
    }

    @GetMapping("/{docHash}")
    public ResponseEntity<?> verify(@PathVariable String docHash) {
        return documentRepo.findByDocHash(docHash)
            .map(doc -> ResponseEntity.ok(Map.of(
                "verified", true,
                "agency", doc.getAgency(),
                "docType", doc.getDocType().name(),
                "issuedAt", doc.getIssuedAt().toString(),
                "chainTxHash", doc.getChainTxHash() != null ? doc.getChainTxHash() : ""
            )))
            .orElse(ResponseEntity.ok(Map.of("verified", false)));
    }
}
