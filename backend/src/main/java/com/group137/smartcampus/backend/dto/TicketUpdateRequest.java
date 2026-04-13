package com.group137.smartcampus.backend.dto;

import com.group137.smartcampus.backend.entity.TicketStatus;
import lombok.Data;

@Data
public class TicketUpdateRequest {
    private TicketStatus status;
    private Long assigneeId;
}
