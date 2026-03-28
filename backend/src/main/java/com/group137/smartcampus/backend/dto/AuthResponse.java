package com.group137.smartcampus.backend.dto;

import com.group137.smartcampus.backend.entity.Role;
import lombok.Builder;
import lombok.Data;

/**
 * Response returned after successful authentication (register / login / OAuth).
 * Member 04 – Module E
 */
@Data
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private Role role;
}
