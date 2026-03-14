package com.govbridge.controller;

import com.govbridge.dto.VerifyNinRequest;
import com.govbridge.dto.VerifyNinResponse;
import com.govbridge.service.NidsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final NidsService nidsService;

    public AuthController(NidsService nidsService) {
        this.nidsService = nidsService;
    }

    @PostMapping("/verify-nin")
    public ResponseEntity<VerifyNinResponse> verifyNin(@RequestBody VerifyNinRequest request) {
        return nidsService.verify(request.getNin())
            .map(citizen -> ResponseEntity.ok(VerifyNinResponse.from(citizen)))
            .orElse(ResponseEntity.status(404).build());
    }
}
