package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.dto.CommentRequest;
import com.group137.smartcampus.backend.dto.CommentResponse;
import com.group137.smartcampus.backend.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets/{ticketId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long ticketId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.addComment(ticketId, request));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicketId(ticketId));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId,
            @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long ticketId,
            @PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok().build();
    }
}
