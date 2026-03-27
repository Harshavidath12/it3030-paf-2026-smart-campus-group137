package com.group137.smartcampus.backend.service;

import com.group137.smartcampus.backend.dto.NotificationRequest;
import com.group137.smartcampus.backend.entity.Notification;
import com.group137.smartcampus.backend.entity.NotificationType;
import com.group137.smartcampus.backend.entity.Role;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for NotificationService.
 * Member 04 – Module D
 */
@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private NotificationService notificationService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder()
                .id(1L)
                .email("test@test.com")
                .name("Test User")
                .role(Role.USER)
                .build();

        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(mockUser);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void getNotificationsForCurrentUser_returnsOnlyCurrentUserNotifications() {
        List<Notification> expected = List.of(
                Notification.builder().id(1L).userId(1L).message("Booking approved").build()
        );
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(expected);

        List<Notification> result = notificationService.getNotificationsForCurrentUser();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getMessage()).isEqualTo("Booking approved");
        verify(notificationRepository).findByUserIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void getUnreadCount_returnsCorrectCount() {
        when(notificationRepository.countByUserIdAndIsReadFalse(1L)).thenReturn(3L);

        Map<String, Long> result = notificationService.getUnreadCount();

        assertThat(result.get("unreadCount")).isEqualTo(3L);
    }

    @Test
    void createNotification_savesAndReturnsNotification() {
        NotificationRequest request = new NotificationRequest();
        request.setUserId(1L);
        request.setMessage("Ticket updated");
        request.setType(NotificationType.TICKET_UPDATE);

        Notification saved = Notification.builder()
                .id(10L).userId(1L).message("Ticket updated")
                .type(NotificationType.TICKET_UPDATE).isRead(false).build();

        when(notificationRepository.save(any(Notification.class))).thenReturn(saved);

        Notification result = notificationService.createNotification(request);

        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getIsRead()).isFalse();
        verify(notificationRepository).save(any(Notification.class));
    }

    @Test
    void markAsRead_updatesIsReadFlag() {
        Notification notification = Notification.builder()
                .id(1L).userId(1L).isRead(false).build();

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        when(notificationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Notification result = notificationService.markAsRead(1L);

        assertThat(result.getIsRead()).isTrue();
    }

    @Test
    void markAsRead_otherUsersNotification_throwsSecurityException() {
        Notification notification = Notification.builder()
                .id(2L).userId(99L).isRead(false).build(); // belongs to user 99

        when(notificationRepository.findById(2L)).thenReturn(Optional.of(notification));

        assertThatThrownBy(() -> notificationService.markAsRead(2L))
                .isInstanceOf(SecurityException.class);
    }

    @Test
    void deleteNotification_removesEntity() {
        Notification notification = Notification.builder()
                .id(1L).userId(1L).isRead(false).build();

        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification));
        doNothing().when(notificationRepository).delete(notification);

        notificationService.deleteNotification(1L);

        verify(notificationRepository).delete(notification);
    }
}
