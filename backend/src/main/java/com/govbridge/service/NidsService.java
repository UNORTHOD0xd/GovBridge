package com.govbridge.service;

import com.govbridge.model.Citizen;
import com.govbridge.repository.CitizenRepository;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Optional;

@Service
public class NidsService {

    private final CitizenRepository citizenRepo;

    public NidsService(CitizenRepository citizenRepo) {
        this.citizenRepo = citizenRepo;
    }

    public Optional<Citizen> verify(String nin) {
        String ninHash = hashNin(nin);
        return citizenRepo.findByNinHash(ninHash);
    }

    public static String hashNin(String nin) {
        try {
            var digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(nin.getBytes(StandardCharsets.UTF_8));
            return "0x" + bytesToHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    private static String bytesToHex(byte[] bytes) {
        var sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }
}
