package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.entity.Role;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Admin-only endpoints for viewing and changing user roles.
 * Member 04 – Module E: Role Management
 *
 * GET /api/users/roles         → list all users with roles (ADMIN)
 * PUT /api/users/{id}/role     → update a user's role (ADMIN)
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class RoleController {

    private final UserService userService;

    @GetMapping("/roles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> getAllUsersWithRoles() {
        List<Map<String, Object>> result = userService.getAllUsers().stream()
                .map(u -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("id",    u.getId());
                    entry.put("name",  u.getName());
                    entry.put("email", u.getEmail());
                    entry.put("role",  u.getRole().name());
                    return entry;
                })
                .toList();
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Role newRole = Role.valueOf(body.get("role").toUpperCase());
        User updated = userService.updateRole(id, newRole);

        Map<String, Object> response = new HashMap<>();
        response.put("id",    updated.getId());
        response.put("email", updated.getEmail());
        response.put("role",  updated.getRole().name());
        return ResponseEntity.ok(response);
    }
}
