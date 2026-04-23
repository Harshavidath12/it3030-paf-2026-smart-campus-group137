package com.group137.smartcampus.backend.service;

import com.group137.smartcampus.backend.dto.CommentRequest;
import com.group137.smartcampus.backend.dto.CommentResponse;
import com.group137.smartcampus.backend.entity.Comment;
import com.group137.smartcampus.backend.entity.Ticket;
import com.group137.smartcampus.backend.entity.User;
import com.group137.smartcampus.backend.repository.CommentRepository;
import com.group137.smartcampus.backend.repository.TicketRepository;
import com.group137.smartcampus.backend.repository.UserRepository;
import com.group137.smartcampus.backend.dto.NotificationRequest;
import com.group137.smartcampus.backend.entity.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;

    public CommentResponse addComment(Long ticketId, CommentRequest request) {
        User currentUser = getCurrentUser();
        
        // Verify ticket exists
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .authorId(currentUser.getId())
                .content(request.getContent())
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Notify the ticket creator if the commenter is not the creator
        if (!ticket.getCreatorId().equals(currentUser.getId())) {
            NotificationRequest notifReq = new NotificationRequest();
            notifReq.setUserId(ticket.getCreatorId());
            notifReq.setMessage("A new comment has been added to your ticket on resource: " + ticket.getResourceName());
            notifReq.setType(NotificationType.COMMENT);
            notifReq.setReferenceId(ticketId);
            notificationService.createNotification(notifReq);
        }

        return mapToResponse(savedComment);
    }

    public List<CommentResponse> getCommentsByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CommentResponse updateComment(Long commentId, CommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        
        User currentUser = getCurrentUser();
        if (!comment.getAuthorId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        return mapToResponse(commentRepository.save(comment));
    }

    public void deleteComment(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        
        User currentUser = getCurrentUser();
        if (!comment.getAuthorId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private CommentResponse mapToResponse(Comment comment) {
        User author = userRepository.findById(comment.getAuthorId()).orElse(null);
        String name = author != null ? author.getName() : "Unknown User";
        String role = author != null ? author.getRole().name() : "USER";

        return CommentResponse.builder()
                .id(comment.getId())
                .ticketId(comment.getTicketId())
                .authorId(comment.getAuthorId())
                .authorName(name)
                .authorRole(role)
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
