package com.group137.smartcampus.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.group137.smartcampus.backend.dto.NotificationRequest;
import com.group137.smartcampus.backend.entity.Notification;
import com.group137.smartcampus.backend.entity.NotificationType;
import com.group137.smartcampus.backend.security.JwtAuthFilter;
import com.group137.smartcampus.backend.service.NotificationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for NotificationController.
 * Member 04 – Module D
 */
@WebMvcTest(
    controllers = NotificationController.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = JwtAuthFilter.class
    )
)
class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private NotificationService notificationService;

    @Test
    @WithMockUser
    void getNotifications_authenticated_returns200() throws Exception {
        Notification n = Notification.builder()
                .id(1L).userId(1L).message("Booking approved")
                .type(NotificationType.BOOKING_APPROVED).isRead(false).build();

        when(notificationService.getNotificationsForCurrentUser()).thenReturn(List.of(n));

        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].message").value("Booking approved"))
                .andExpect(jsonPath("$[0].isRead").value(false));
    }

    @Test
    void getNotifications_unauthenticated_returns403() throws Exception {
        mockMvc.perform(get("/api/notifications"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser
    void getUnreadCount_authenticated_returns200() throws Exception {
        when(notificationService.getUnreadCount()).thenReturn(Map.of("unreadCount", 5L));

        mockMvc.perform(get("/api/notifications/unread-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.unreadCount").value(5));
    }

    @Test
    @WithMockUser
    void markAsRead_existingId_returns200() throws Exception {
        Notification n = Notification.builder()
                .id(1L).userId(1L).message("Test").isRead(true).build();
        when(notificationService.markAsRead(1L)).thenReturn(n);

        mockMvc.perform(patch("/api/notifications/1/read").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.isRead").value(true));
    }

    @Test
    @WithMockUser
    void deleteNotification_existingId_returns204() throws Exception {
        doNothing().when(notificationService).deleteNotification(1L);

        mockMvc.perform(delete("/api/notifications/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createNotification_withAdminUser_returns201() throws Exception {
        NotificationRequest request = new NotificationRequest();
        request.setUserId(2L);
        request.setMessage("Your booking was rejected");
        request.setType(NotificationType.BOOKING_REJECTED);

        Notification saved = Notification.builder()
                .id(5L).userId(2L).message("Your booking was rejected")
                .type(NotificationType.BOOKING_REJECTED).isRead(false).build();

        when(notificationService.createNotification(any())).thenReturn(saved);

        mockMvc.perform(post("/api/notifications")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(5));
    }
}
