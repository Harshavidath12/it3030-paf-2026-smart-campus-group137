package com.group137.smartcampus.backend.dto;

import com.group137.smartcampus.backend.entity.TicketPriority;
import lombok.Data;

@Data
public class TicketRequest {
    private String resourceName;
    private String description;
    private TicketPriority priority;
    private String imageBase64;
}
