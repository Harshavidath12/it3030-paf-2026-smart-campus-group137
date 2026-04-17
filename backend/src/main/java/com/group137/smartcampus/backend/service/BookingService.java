package com.group137.smartcampus.backend.service;

import com.group137.smartcampus.backend.dto.*;
import com.group137.smartcampus.backend.model.BookingStatus;
import java.util.List;

/**
 * Service interface defining the booking management operations.
 */
public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO requestDTO, String userId, String email);
    BookingResponseDTO getBookingById(Long id);
    List<BookingResponseDTO> getUserBookings(String userId);
    
    // Admin Operations
    List<BookingResponseDTO> getAdminBookings(BookingStatus status);
    BookingResponseDTO adminReview(Long id, BookingReviewRequest reviewRequest, String adminId);
    
    BookingResponseDTO cancelBooking(Long id, String userId);
    void deleteBooking(Long id);
    BookingResponseDTO checkInWithQRCode(String qrToken);
    QRVerificationResponse verifyQRCode(String qrToken);
}
