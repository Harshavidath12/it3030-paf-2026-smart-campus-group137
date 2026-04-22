package com.group137.smartcampus.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private Long ticketId;
    private Long authorId;
    private String authorName;
    private String authorRole;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
