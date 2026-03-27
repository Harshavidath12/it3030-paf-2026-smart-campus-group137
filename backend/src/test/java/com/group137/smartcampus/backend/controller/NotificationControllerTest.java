package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.dto.NotificationRequest;
import com.group137.smartcampus.backend.entity.Notification;
import com.group137.smartcampus.backend.entity.NotificationType;
import com.group137.smartcampus.backend.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for NotificationController using pure Mockito (no Spring context).
 * Member 04 – Module D
 */
@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private NotificationController notificationController;

    @Test
    void getNotifications_returnsListWith200() {
        Notification n = Notification.builder()
                .id(1L).userId(1L).message("Booking approved")
                .type(NotificationType.BOOKING_APPROVED).isRead(false).build();

        when(notificationService.getNotificationsForCurrentUser()).thenReturn(List.of(n));

        ResponseEntity<List<Notification>> response = notificationController.getNotifications();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).hasSize(1);
        assertThat(response.getBody().get(0).getMessage()).isEqualTo("Booking approved");
    }

    @Test
    void getUnreadCount_returnsCountWith200() {
        when(notificationService.getUnreadCount()).thenReturn(Map.of("unreadCount", 3L));

        ResponseEntity<Map<String, Long>> response = notificationController.getUnreadCount();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("unreadCount", 3L);
    }

    @Test
    void createNotification_returns201WithCreatedEntity() {
        NotificationRequest request = new NotificationRequest();
        request.setUserId(1L);
        request.setMessage("Ticket updated");
        request.setType(NotificationType.TICKET_UPDATE);

        Notification saved = Notification.builder()
                .id(10L).userId(1L).message("Ticket updated")
                .type(NotificationType.TICKET_UPDATE).isRead(false).build();

        when(notificationService.createNotification(any())).thenReturn(saved);

        ResponseEntity<Notification> response = notificationController.createNotification(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getId()).isEqualTo(10L);
    }

    @Test
    void markAsRead_existingId_returns200WithUpdatedEntity() {
        Notification n = Notification.builder()
                .id(1L).userId(1L).isRead(true).build();

        when(notificationService.markAsRead(1L)).thenReturn(n);

        ResponseEntity<Notification> response = notificationController.markAsRead(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getIsRead()).isTrue();
    }

    @Test
    void deleteNotification_existingId_returns204() {
        doNothing().when(notificationService).deleteNotification(1L);

        ResponseEntity<Void> response = notificationController.deleteNotification(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(notificationService).deleteNotification(1L);
    }

    @Test
    void createNotification_serviceReturnsEntity_returns201() {
        NotificationRequest request = new NotificationRequest();
        request.setUserId(2L);
        request.setMessage("Booking rejected");
        request.setType(NotificationType.BOOKING_REJECTED);

        Notification saved = Notification.builder()
                .id(5L).userId(2L).message("Booking rejected")
                .type(NotificationType.BOOKING_REJECTED).isRead(false).build();

        when(notificationService.createNotification(any())).thenReturn(saved);

        ResponseEntity<Notification> response = notificationController.createNotification(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getId()).isEqualTo(5L);
    }
}
