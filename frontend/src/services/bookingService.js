import axios from 'axios';

// API base URL - uses YOUR backend port (8084)
const API_URL = 'http://localhost:8084/api/bookings';

// Headers to simulate logged-in user (mock OAuth2)
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-user-id': 'user123',
    'x-user-email': 'student@smartcampus.edu'
});

// POST /api/bookings - Create new booking
export const createBooking = async (bookingData) => {
    const response = await axios.post(API_URL, bookingData, { headers: getHeaders() });
    return response.data;
};

// GET /api/bookings/my-bookings - Get user's bookings
export const getMyBookings = async () => {
    const response = await axios.get(`${API_URL}/my-bookings`, { headers: getHeaders() });
    return response.data;
};

// GET /api/bookings/:id - Get booking by ID
export const getBookingById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, { headers: getHeaders() });
    return response.data;
};

// PATCH /api/bookings/:id/cancel - Cancel booking
export const cancelBooking = async (id) => {
    const response = await axios.patch(`${API_URL}/${id}/cancel`, {}, { headers: getHeaders() });
    return response.data;
};

// PUT /api/bookings/:id/review - Admin approve/reject
export const reviewBooking = async (id, isApproved, adminRemarks = '', rejectionReason = '') => {
    const data = { isApproved, adminRemarks, rejectionReason };
    const response = await axios.put(`${API_URL}/${id}/review`, data, { headers: getHeaders() });
    return response.data;
};

// POST /api/bookings/check-in - QR code check-in
export const checkInWithQRCode = async (qrToken) => {
    const response = await axios.post(`${API_URL}/check-in`, { qrToken }, { headers: getHeaders() });
    return response.data;
};

// DELETE /api/bookings/:id - Delete booking
export const deleteBooking = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getHeaders() });
    return response.data;
};
