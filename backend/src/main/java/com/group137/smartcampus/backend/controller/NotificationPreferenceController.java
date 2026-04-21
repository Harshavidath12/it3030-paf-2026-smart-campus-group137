package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.entity.NotificationPreference;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notification-preferences")
@RequiredArgsConstructor
public class NotificationPreferenceController {

    private final NotificationPreferenceRepository preferenceRepository;

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<NotificationPreference> getPreferences() {
        User currentUser = getCurrentUser();
        NotificationPreference pref = preferenceRepository.findById(currentUser.getId())
                .orElse(NotificationPreference.builder().userId(currentUser.getId()).build());
        return ResponseEntity.ok(pref);
    }

    @PutMapping
    public ResponseEntity<NotificationPreference> updatePreferences(@RequestBody NotificationPreference newPref) {
        User currentUser = getCurrentUser();
        // Ensure userId cannot be overwritten to another user
        newPref.setUserId(currentUser.getId());
        NotificationPreference saved = preferenceRepository.save(newPref);
        return ResponseEntity.ok(saved);
    }
}
