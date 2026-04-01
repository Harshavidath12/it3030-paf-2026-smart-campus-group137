package com.group137.smartcampus.backend.service.impl;

import com.group137.smartcampus.backend.dto.*;
import com.group137.smartcampus.backend.exception.BookingConflictException;
import com.group137.smartcampus.backend.exception.ResourceNotFoundException;
import com.group137.smartcampus.backend.model.Booking;
import com.group137.smartcampus.backend.model.BookingStatus;
import com.group137.smartcampus.backend.repository.BookingRepository;
import com.group137.smartcampus.backend.service.BookingService;
import com.group137.smartcampus.backend.service.QRCodeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * Implementation of BookingService containing all business logic
 * for booking management, conflict detection, and QR check-in.
 */
@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final QRCodeService qrCodeService;

    // Constructor injection (no @Autowired needed with single constructor)
    public BookingServiceImpl(BookingRepository bookingRepository, QRCodeService qrCodeService) {
        this.bookingRepository = bookingRepository;
        this.qrCodeService = qrCodeService;
    }

    /**
     * Creates a new booking after validating times and checking for conflicts.
     * Uses the conflict detection query to prevent overlapping bookings.
     */
    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO requestDTO, String userId, String email) {
        // Validate that start time is before end time
        if (!requestDTO.getStartTime().isBefore(requestDTO.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Conflict Detection: check for overlapping bookings with PENDING or APPROVED status
        List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.PENDING, BookingStatus.APPROVED);
        List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                requestDTO.getResourceId(),
                requestDTO.getBookingDate(),
                requestDTO.getStartTime(),
                requestDTO.getEndTime(),
                activeStatuses
        );

        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("Resource is already booked for the selected time slot");
        }

        // Build and save the new booking entity
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setUserEmail(email);
        booking.setResourceId(requestDTO.getResourceId());
        booking.setBookingDate(requestDTO.getBookingDate());
        booking.setStartTime(requestDTO.getStartTime());
        booking.setEndTime(requestDTO.getEndTime());
        booking.setPurpose(requestDTO.getPurpose());
        booking.setExpectedAttendees(requestDTO.getExpectedAttendees());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        return mapToDTO(saved);
    }

    @Override
    public BookingResponseDTO getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
        return mapToDTO(booking);
    }

    @Override
    public List<BookingResponseDTO> getUserBookings(String userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDescStartTimeDesc(userId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Admin approves or rejects a pending booking.
     * On approval, generates a unique QR code token (UUID) for check-in.
     */
    @Override
    public List<BookingResponseDTO> getAdminBookings(BookingStatus status) {
        List<Booking> bookings;
        if (status == null) {
            bookings = bookingRepository.findAll();
        } else {
            bookings = bookingRepository.findByStatusOrderByBookingDateDescStartTimeDesc(status);
        }
        return bookings.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponseDTO adminReview(Long id, BookingReviewRequest reviewRequest, String adminId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking ID " + id + " not found"));

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new IllegalArgumentException("Only PENDING bookings can be reviewed.");
        }

        if (Boolean.TRUE.equals(reviewRequest.getApproved())) {
            // Re-check for conflicts before approving
            List<BookingStatus> activeStatuses = Arrays.asList(BookingStatus.APPROVED, BookingStatus.CHECKED_IN);
            List<Booking> conflicts = bookingRepository.findOverlappingBookings(
                    booking.getResourceId(), booking.getBookingDate(),
                    booking.getStartTime(), booking.getEndTime(), activeStatuses
            );

            if (!conflicts.isEmpty()) {
                throw new BookingConflictException("Cannot approve: The slot is now occupied by another booking");
            }

            booking.setStatus(BookingStatus.APPROVED);
            booking.setAdminRemarks(reviewRequest.getRemarks());
            booking.setApprovedBy(adminId);
            booking.setApprovedAt(LocalDateTime.now());
            booking.setQrCodeData(UUID.randomUUID().toString());
        } else {
            booking.setStatus(BookingStatus.REJECTED);
            booking.setRejectionReason(reviewRequest.getRemarks());
            booking.setAdminRemarks(reviewRequest.getRemarks());
        }

        return mapToDTO(bookingRepository.save(booking));
    }


    /**
     * User cancels their own booking (must be PENDING or APPROVED).
     */
    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long id, String userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));

        if (!booking.getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own bookings");
        }

        if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalArgumentException("Only pending or approved bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setQrCodeData(null); // Invalidate QR on cancellation

        Booking saved = bookingRepository.save(booking);
        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new ResourceNotFoundException("Booking not found with ID: " + id);
        }
        bookingRepository.deleteById(id);
    }

    /**
     * Innovation Feature: QR Code Check-in
     * Validates the QR token, booking date, and check-in time window.
     */
    @Override
    @Transactional
    public BookingResponseDTO checkInWithQRCode(String qrToken) {
        Booking booking = bookingRepository.findByQrCodeData(qrToken)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired QR token"));

        // Run all check-in validation rules
        validateCheckIn(booking);

        booking.setStatus(BookingStatus.CHECKED_IN);
        booking.setCheckedInAt(LocalDateTime.now());

        Booking saved = bookingRepository.save(booking);
        return mapToDTO(saved);
    }

    @Override
    public QRVerificationResponse verifyQRCode(String qrToken) {
        try {
            Booking booking = bookingRepository.findByQrCodeData(qrToken)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid QR token"));
            validateCheckIn(booking);
            return new QRVerificationResponse(true, "QR Code is valid for check-in", mapToDTO(booking));
        } catch (Exception e) {
            return new QRVerificationResponse(false, e.getMessage(), null);
        }
    }

    /**
     * Validates all check-in business rules:
     * 1. Booking must be APPROVED
     * 2. Must be the exact booking date (today)
     * 3. Current time must be within window (15 min before start to end time)
     */
    private void validateCheckIn(Booking booking) {
        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalArgumentException("Booking must be in APPROVED status for check-in. Current: " + booking.getStatus());
        }

        LocalDate today = LocalDate.now();
        if (!booking.getBookingDate().equals(today)) {
            throw new IllegalArgumentException("Check-in is only allowed on the booking date (" + booking.getBookingDate() + ")");
        }

        LocalTime now = LocalTime.now();
        LocalTime windowStart = booking.getStartTime().minusMinutes(15);
        LocalTime windowEnd = booking.getEndTime();

        if (now.isBefore(windowStart)) {
            throw new IllegalArgumentException("Check-in window opens 15 minutes before start time (" + booking.getStartTime() + ")");
        }
        if (now.isAfter(windowEnd)) {
            throw new IllegalArgumentException("Check-in window has closed. Booking ended at " + windowEnd);
        }
    }

    /**
     * Maps a Booking entity to BookingResponseDTO.
     * If the booking has a QR token, generates the Base64 QR image for the response.
     */
    private BookingResponseDTO mapToDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUserId());
        dto.setUserEmail(booking.getUserEmail());
        dto.setResourceId(booking.getResourceId());
        dto.setBookingDate(booking.getBookingDate());
        dto.setStartTime(booking.getStartTime());
        dto.setEndTime(booking.getEndTime());
        dto.setPurpose(booking.getPurpose());
        dto.setExpectedAttendees(booking.getExpectedAttendees());
        dto.setStatus(booking.getStatus());
        dto.setRejectionReason(booking.getRejectionReason());
        dto.setAdminRemarks(booking.getAdminRemarks());
        dto.setCheckedInAt(booking.getCheckedInAt());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        dto.setApprovedBy(booking.getApprovedBy());
        dto.setApprovedAt(booking.getApprovedAt());

        // Generate QR image only for APPROVED bookings with a token
        if (booking.getQrCodeData() != null && booking.getStatus() == BookingStatus.APPROVED) {
            dto.setQrCodeData(qrCodeService.generateQRCodeImage(booking.getQrCodeData()));
        }

        return dto;
    }
}
