package com.govbridge.controller;

import com.govbridge.model.Citizen;
import com.govbridge.model.Document;
import com.govbridge.repository.CitizenRepository;
import com.govbridge.repository.DocumentRepository;
import com.govbridge.service.CertificateService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/documents")
public class CertificateController {

    private final DocumentRepository documentRepository;
    private final CitizenRepository citizenRepository;
    private final CertificateService certificateService;

    public CertificateController(DocumentRepository documentRepository,
                                  CitizenRepository citizenRepository,
                                  CertificateService certificateService) {
        this.documentRepository = documentRepository;
        this.citizenRepository = citizenRepository;
        this.certificateService = certificateService;
    }

    @GetMapping("/{docHash}/pdf")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String docHash) {
        Document document = documentRepository.findByDocHash(docHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Document not found"));

        Citizen citizen = citizenRepository.findById(document.getCitizenId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Citizen not found"));

        try {
            byte[] pdf = certificateService.generatePdf(document, citizen);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"govbridge-certificate.pdf\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdf);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to generate certificate");
        }
    }
}
