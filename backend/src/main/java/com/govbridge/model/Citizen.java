package com.govbridge.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "citizens")
public class Citizen {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "nin_hash", nullable = false, unique = true, length = 66)
    private String ninHash;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 100)
    private String parish;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @Column(name = "jamdex_balance", nullable = false)
    private Long jamdexBalance = 0L;

    @Column(nullable = false)
    private Boolean verified = false;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNinHash() { return ninHash; }
    public void setNinHash(String ninHash) { this.ninHash = ninHash; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getParish() { return parish; }
    public void setParish(String parish) { this.parish = parish; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public Long getJamdexBalance() { return jamdexBalance; }
    public void setJamdexBalance(Long jamdexBalance) { this.jamdexBalance = jamdexBalance; }

    public Boolean getVerified() { return verified; }
    public void setVerified(Boolean verified) { this.verified = verified; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
