package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.dto.AuthResponse;
import com.group137.smartcampus.backend.dto.LoginRequest;
import com.group137.smartcampus.backend.dto.RegisterRequest;
import com.group137.smartcampus.backend.entity.Role;
import com.group137.smartcampus.backend.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Unit tests for AuthController using pure Mockito (no Spring context).
 * Member 04 – Module E
 */
@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private AuthResponse mockAuthResponse;

    @BeforeEach
    void setUp() {
        mockAuthResponse = AuthResponse.builder()
                .token("mocked.jwt.token")
                .userId(1L)
                .name("Alice")
                .email("alice@test.com")
                .role(Role.USER)
                .build();
    }

    @Test
    void register_withValidRequest_returns201WithToken() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice");
        request.setEmail("alice@test.com");
        request.setPassword("password123");

        when(authService.register(any(RegisterRequest.class))).thenReturn(mockAuthResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isEqualTo("mocked.jwt.token");
        assertThat(response.getBody().getEmail()).isEqualTo("alice@test.com");
        assertThat(response.getBody().getRole()).isEqualTo(Role.USER);
    }

    @Test
    void login_withValidCredentials_returns200WithToken() {
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@test.com");
        request.setPassword("password123");

        when(authService.login(any(LoginRequest.class))).thenReturn(mockAuthResponse);

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isEqualTo("mocked.jwt.token");
    }

    @Test
    void login_withWrongPassword_throwsBadCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("alice@test.com");
        request.setPassword("wrongpassword");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThatThrownBy(() -> authController.login(request))
                .isInstanceOf(BadCredentialsException.class)
                .hasMessageContaining("Bad credentials");
    }

    @Test
    void register_duplicateEmail_throwsIllegalState() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Alice");
        request.setEmail("alice@test.com");
        request.setPassword("password123");

        when(authService.register(any()))
                .thenThrow(new IllegalStateException("Email already in use"));

        assertThatThrownBy(() -> authController.register(request))
                .isInstanceOf(IllegalStateException.class);
    }
}
