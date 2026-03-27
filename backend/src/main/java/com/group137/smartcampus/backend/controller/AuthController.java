package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.dto.AuthResponse;
import com.group137.smartcampus.backend.dto.LoginRequest;
import com.group137.smartcampus.backend.dto.RegisterRequest;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST endpoints for user registration, login, and profile.
 * Member 04 – Module E: Authentication
 *
 * GET  /api/auth/me       → current user info (authenticated)
 * POST /api/auth/register → register new account
 * POST /api/auth/login    → login and receive JWT
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(Map.of(
                "id",    user.getId(),
                "name",  user.getName(),
                "email", user.getEmail(),
                "role",  user.getRole()
        ));
    }
}
