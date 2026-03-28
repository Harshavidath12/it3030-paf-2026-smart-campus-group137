package com.group137.smartcampus.backend.dto;

import com.group137.smartcampus.backend.entity.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Request body for creating a notification (admin/system use).
 * Member 04 – Module D
 */
@Data
public class NotificationRequest {

    @NotNull(message = "userId is required")
    private Long userId;

    @NotBlank(message = "message is required")
    private String message;

    @NotNull(message = "type is required")
    private NotificationType type;

    private Long referenceId;
}
