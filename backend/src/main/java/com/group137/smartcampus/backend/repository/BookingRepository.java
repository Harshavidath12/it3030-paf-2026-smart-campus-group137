package com.group137.smartcampus.backend.repository;

import com.group137.smartcampus.backend.model.Booking;
import com.group137.smartcampus.backend.model.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for Booking entity.
 * Includes custom JPQL query for conflict detection.
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find all bookings for a specific user
    List<Booking> findByUserIdOrderByBookingDateDescStartTimeDesc(String userId);

    // Admin: Find all bookings filtered by status
    List<Booking> findByStatusOrderByBookingDateDescStartTimeDesc(BookingStatus status);

    // Find booking by QR code token
    Optional<Booking> findByQrCodeData(String qrCodeData);

    /**
     * Conflict Detection Query:
     * Finds any existing bookings that overlap with the requested time slot.
     *
     * Two time intervals [A_start, A_end] and [B_start, B_end] overlap
     * if and only if: A_start < B_end AND A_end > B_start
     *
     * Only checks against PENDING and APPROVED bookings (active bookings).
     */
    @Query("SELECT b FROM Booking b WHERE b.resourceId = :resourceId " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.status IN :statuses " +
           "AND b.startTime < :endTime " +
           "AND b.endTime > :startTime")
    List<Booking> findOverlappingBookings(
            @Param("resourceId") Long resourceId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("statuses") List<BookingStatus> statuses
    );
}
