package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.dto.*;
import com.group137.smartcampus.backend.model.BookingStatus;
import com.group137.smartcampus.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(originPatterns = {
        "http://localhost:*",
        "http://127.0.0.1:*"
})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    private String getUserId(String headerUserId) {
        return (headerUserId != null && !headerUserId.isEmpty()) ? headerUserId : "user123";
    }

    private String getUserEmail(String headerUserEmail) {
        return (headerUserEmail != null && !headerUserEmail.isEmpty()) ? headerUserEmail : "student@smartcampus.edu";
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO requestDTO,
            @RequestHeader(value = "x-user-id", required = false) String userId,
            @RequestHeader(value = "x-user-email", required = false) String email) {

        BookingResponseDTO response = bookingService.createBooking(
                requestDTO, getUserId(userId), getUserEmail(email));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        BookingResponseDTO response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @RequestHeader(value = "x-user-id", required = false) String userId) {

        List<BookingResponseDTO> responses = bookingService.getUserBookings(getUserId(userId));
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/admin")
    public ResponseEntity<List<BookingResponseDTO>> getAdminBookings(
            @RequestParam(required = false) BookingStatus status,
            @RequestHeader(value = "x-user-role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        List<BookingResponseDTO> responses = bookingService.getAdminBookings(status);
        return ResponseEntity.ok(responses);
    }

    @PatchMapping("/admin/{id}/approve")
    public ResponseEntity<BookingResponseDTO> approveBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingReviewRequest reviewRequest,
            @RequestHeader(value = "x-user-id", required = false) String adminId,
            @RequestHeader(value = "x-user-role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        BookingReviewRequest req = (reviewRequest != null) ? reviewRequest : new BookingReviewRequest();
        req.setApproved(true);

        return ResponseEntity.ok(bookingService.adminReview(id, req, getUserId(adminId)));
    }

    @PatchMapping("/admin/{id}/reject")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
            @PathVariable Long id,
            @RequestBody BookingReviewRequest reviewRequest,
            @RequestHeader(value = "x-user-id", required = false) String adminId,
            @RequestHeader(value = "x-user-role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        reviewRequest.setApproved(false);
        return ResponseEntity.ok(bookingService.adminReview(id, reviewRequest, getUserId(adminId)));
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> adminDelete(
            @PathVariable Long id,
            @RequestHeader(value = "x-user-role", required = false) String role) {

        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @RequestHeader(value = "x-user-id", required = false) String userId) {

        BookingResponseDTO response = bookingService.cancelBooking(id, getUserId(userId));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/check-in")
    public ResponseEntity<BookingResponseDTO> checkIn(
            @Valid @RequestBody QRCheckInDTO checkInDTO) {

        BookingResponseDTO response = bookingService.checkInWithQRCode(checkInDTO.getQrToken());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-qr/{token}")
    public ResponseEntity<QRVerificationResponse> verifyQRCode(@PathVariable String token) {
        QRVerificationResponse response = bookingService.verifyQRCode(token);
        if (response.isValid()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
