import axios from 'axios';

// Admin-specific API service for Booking Management
const API_URL = 'http://localhost:8084/api/bookings/admin';

// Static headers for admin simulation
const adminHeaders = () => ({
    'Content-Type': 'application/json',
    'x-user-id': 'admin_manager_01',
    'x-user-role': 'ADMIN'
});

/**
 * Fetches all bookings, optionally filtered by status.
 */
export const fetchAdminBookings = async (statusFilter = '') => {
    const url = statusFilter ? `${API_URL}?status=${statusFilter}` : API_URL;
    const response = await axios.get(url, { headers: adminHeaders() });
    return response.data;
};

/**
 * Approves a pending booking.
 */
export const approveBooking = async (id, remarks) => {
    const response = await axios.patch(`${API_URL}/${id}/approve`, 
        { remarks }, 
        { headers: adminHeaders() }
    );
    return response.data;
};

/**
 * Rejects a pending booking.
 */
export const rejectBooking = async (id, remarks) => {
    const response = await axios.patch(`${API_URL}/${id}/reject`, 
        { remarks }, 
        { headers: adminHeaders() }
    );
    return response.data;
};

/**
 * Deletes a booking from the system.
 */
export const deleteBooking = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: adminHeaders() });
    return response.data;
};
