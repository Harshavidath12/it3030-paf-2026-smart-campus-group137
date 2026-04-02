-- PostgreSQL Database Schema for Smart Campus Booking Management
-- Create this table in the 'smartcampus' database

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    resource_id BIGINT NOT NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose VARCHAR(500) NOT NULL,
    expected_attendees INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    rejection_reason VARCHAR(500),
    admin_remarks VARCHAR(500),
    qr_code_data VARCHAR(255) UNIQUE,
    checked_in_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by VARCHAR(255),
    approved_at TIMESTAMP
);

-- Index for conflict detection optimization
CREATE INDEX IF NOT EXISTS idx_booking_overlap 
ON bookings (resource_id, booking_date, status);
