package com.group137.smartcampus.backend.dto;

import com.group137.smartcampus.backend.entity.TicketPriority;
import com.group137.smartcampus.backend.entity.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private String resourceName;
    private String description;
    private TicketPriority priority;
    private TicketStatus status;
    private String contactNumber;
    private String email;
    private String imageBase64;
    private Long creatorId;
    private String creatorName;
    private Long assigneeId;
    private String assigneeName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
