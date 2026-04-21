package com.group137.smartcampus.backend.service;

import com.group137.smartcampus.backend.dto.NotificationRequest;
import com.group137.smartcampus.backend.entity.Notification;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.repository.NotificationRepository;
import com.group137.smartcampus.backend.entity.NotificationPreference;
import com.group137.smartcampus.backend.repository.NotificationPreferenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Business logic for Notifications.
 * Member 04 – Module D: Notifications
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;

    /** Get all notifications for the currently authenticated user. */
    public List<Notification> getNotificationsForCurrentUser() {
        User currentUser = getCurrentUser();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    /** Count unread notifications for the currently authenticated user. */
    public Map<String, Long> getUnreadCount() {
        User currentUser = getCurrentUser();
        long count = notificationRepository.countByUserIdAndIsReadFalse(currentUser.getId());
        return Map.of("unreadCount", count);
    }

    /** Create a new notification (called by system / admin). */
    public Notification createNotification(NotificationRequest request) {
        // Check preferences
        NotificationPreference pref = preferenceRepository.findById(request.getUserId())
                .orElse(NotificationPreference.builder().userId(request.getUserId()).build());

        if (pref.isDisableAll()) {
            return null; // Suppress notification
        }

        // Web notifications logic since emails are external
        boolean allow = true;
        switch (request.getType()) {
            case BOOKING_APPROVED:
            case BOOKING_REJECTED:
                allow = pref.isBookingWebEnabled();
                break;
            case TICKET_UPDATE:
                allow = pref.isTicketWebEnabled();
                break;
            case COMMENT:
            case GENERAL:
                allow = pref.isGeneralWebEnabled();
                break;
        }

        if (!allow) {
            return null; // Suppress notification
        }

        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .message(request.getMessage())
                .type(request.getType())
                .referenceId(request.getReferenceId())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    /** Mark a specific notification as read. */
    public Notification markAsRead(Long id) {
        Notification notification = findNotificationForCurrentUser(id);
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    /** Delete a notification belonging to the current user. */
    public void deleteNotification(Long id) {
        Notification notification = findNotificationForCurrentUser(id);
        notificationRepository.delete(notification);
    }

    // ---- Private helpers ----

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private Notification findNotificationForCurrentUser(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + id));

        User currentUser = getCurrentUser();
        if (!notification.getUserId().equals(currentUser.getId())) {
            throw new SecurityException("Access denied to notification: " + id);
        }
        return notification;
    }
}
