package com.govbridge.repository;

import com.govbridge.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, UUID> {
    List<ServiceRequest> findByCitizenIdOrderByCreatedAtDesc(UUID citizenId);
}
