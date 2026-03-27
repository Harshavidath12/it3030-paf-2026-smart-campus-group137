package com.group137.smartcampus.backend.security;

import com.group137.smartcampus.backend.entity.AuthProvider;
import com.group137.smartcampus.backend.entity.Role;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

/**
 * Handles successful Google OAuth2 login:
 * - Creates or updates the user in the DB.
 * - Issues a JWT and redirects the React frontend.
 * Member 04 – Module E: OAuth Integration
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name  = oAuth2User.getAttribute("name");

        // Create the user if they don't exist yet
        User user = userRepository.findByEmail(email).orElseGet(() ->
                userRepository.save(
                        User.builder()
                                .email(email)
                                .name(name)
                                .role(Role.USER)
                                .provider(AuthProvider.GOOGLE)
                                .createdAt(LocalDateTime.now())
                                .build()
                )
        );

        // Issue JWT and redirect back to React frontend
        String token = jwtUtil.generateToken(user);
        String redirectUrl = "http://localhost:3000/oauth2/callback?token=" + token;
        response.sendRedirect(redirectUrl);
    }
}
