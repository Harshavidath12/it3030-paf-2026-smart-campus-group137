package com.group137.smartcampus.backend.controller;

import com.group137.smartcampus.backend.dto.*;
import com.group137.smartcampus.backend.model.BookingStatus;
import com.group137.smartcampus.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Booking Management.
 * Provides 8 endpoints using GET, POST, PUT, PATCH, DELETE methods.
 *
 * Since OAuth2 is not fully configured for local development,
 * user identity is passed via custom headers (x-user-id, x-user-email).
 * In production, these would come from the JWT / SecurityContext.
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Helper: extract user ID from header (mock OAuth2)
    private String getUserId(String headerUserId) {
        return (headerUserId != null && !headerUserId.isEmpty()) ? headerUserId : "user123";
    }

    // Helper: extract user email from header (mock OAuth2)
    private String getUserEmail(String headerUserEmail) {
        return (headerUserEmail != null && !headerUserEmail.isEmpty()) ? headerUserEmail : "student@smartcampus.edu";
    }

    // ==================== ENDPOINT 1: CREATE BOOKING (POST) ====================
    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(
            @Valid @RequestBody BookingRequestDTO requestDTO,
            @RequestHeader(value = "x-user-id", required = false) String userId,
            @RequestHeader(value = "x-user-email", required = false) String email) {

        BookingResponseDTO response = bookingService.createBooking(
                requestDTO, getUserId(userId), getUserEmail(email));
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // ==================== ENDPOINT 2: GET BOOKING BY ID (GET) ====================
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        BookingResponseDTO response = bookingService.getBookingById(id);
        return ResponseEntity.ok(response);
    }

    // ==================== ENDPOINT 3: GET MY BOOKINGS (GET) ====================
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(
            @RequestHeader(value = "x-user-id", required = false) String userId) {

        List<BookingResponseDTO> responses = bookingService.getUserBookings(getUserId(userId));
        return ResponseEntity.ok(responses);
    }

    // ==================== ADMIN ENDPOINT 1: VIEW ALL BOOKINGS (GET) ====================
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

    // ==================== ADMIN ENDPOINT 2: APPROVE (PATCH) ====================
    @PatchMapping("/admin/{id}/approve")
    public ResponseEntity<BookingResponseDTO> approveBooking(
            @PathVariable Long id,
            @RequestBody(required = false) BookingReviewRequest reviewRequest,
            @RequestHeader(value = "x-user-id", required = false) String adminId,
            @RequestHeader(value = "x-user-role", required = false) String role) {

        if (!"ADMIN".equals(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        
        BookingReviewRequest req = (reviewRequest != null) ? reviewRequest : new BookingReviewRequest();
        req.setApproved(true);
        
        return ResponseEntity.ok(bookingService.adminReview(id, req, getUserId(adminId)));
    }

    // ==================== ADMIN ENDPOINT 3: REJECT (PATCH) ====================
    @PatchMapping("/admin/{id}/reject")
    public ResponseEntity<BookingResponseDTO> rejectBooking(
            @PathVariable Long id,
            @RequestBody BookingReviewRequest reviewRequest,
            @RequestHeader(value = "x-user-id", required = false) String adminId,
            @RequestHeader(value = "x-user-role", required = false) String role) {

        if (!"ADMIN".equals(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        
        reviewRequest.setApproved(false);
        return ResponseEntity.ok(bookingService.adminReview(id, reviewRequest, getUserId(adminId)));
    }

    // ==================== ADMIN ENDPOINT 4: DELETE (DELETE) ====================
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> adminDelete(
            @PathVariable Long id,
            @RequestHeader(value = "x-user-role", required = false) String role) {

        if (!"ADMIN".equals(role)) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ENDPOINT 5: CANCEL BOOKING (PATCH) ====================
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<BookingResponseDTO> cancelBooking(
            @PathVariable Long id,
            @RequestHeader(value = "x-user-id", required = false) String userId) {

        BookingResponseDTO response = bookingService.cancelBooking(id, getUserId(userId));
        return ResponseEntity.ok(response);
    }

    // ==================== ENDPOINT 6: DELETE BOOKING (DELETE) ====================
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ENDPOINT 7: QR CHECK-IN (POST) - Innovation ====================
    @PostMapping("/check-in")
    public ResponseEntity<BookingResponseDTO> checkIn(
            @Valid @RequestBody QRCheckInDTO checkInDTO) {

        BookingResponseDTO response = bookingService.checkInWithQRCode(checkInDTO.getQrToken());
        return ResponseEntity.ok(response);
    }

    // ==================== ENDPOINT 8: VERIFY QR CODE (GET) - Innovation ====================
    @GetMapping("/verify-qr/{token}")
    public ResponseEntity<QRVerificationResponse> verifyQRCode(@PathVariable String token) {
        QRVerificationResponse response = bookingService.verifyQRCode(token);
        if (response.isValid()) {
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.badRequest().body(response);
    }
}
