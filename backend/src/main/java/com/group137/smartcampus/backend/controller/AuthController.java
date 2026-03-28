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

import java.util.HashMap;
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
        Map<String, Object> body = new HashMap<>();
        body.put("id",    user.getId());
        body.put("name",  user.getName());
        body.put("email", user.getEmail());
        body.put("role",  user.getRole());
        body.put("profilePicture", user.getProfilePicture());
        return ResponseEntity.ok(body);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleIllegalState(IllegalStateException ex) {
        Map<String, String> body = new HashMap<>();
        body.put("error", "Bad Request");
        body.put("message", ex.getMessage());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAll(Exception ex) {
        ex.printStackTrace();
        Map<String, String> body = new HashMap<>();
        body.put("error", "Internal Server Error");
        body.put("message", ex.getClass().getName() + ": " + ex.getMessage());
        if (ex.getCause() != null) {
            body.put("cause", ex.getCause().getClass().getName() + ": " + ex.getCause().getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
