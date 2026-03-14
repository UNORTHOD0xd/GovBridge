package com.govbridge.repository;

import com.govbridge.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DocumentRepository extends JpaRepository<Document, UUID> {
    List<Document> findByCitizenIdOrderByIssuedAtDesc(UUID citizenId);
    Optional<Document> findByDocHash(String docHash);
}
