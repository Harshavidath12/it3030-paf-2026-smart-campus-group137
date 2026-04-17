import axios from 'axios';
import { getStoredUser } from './authService';

const API_URL = 'http://localhost:8084/api/bookings';

const getHeaders = () => {
  const user = getStoredUser();

  return {
    'Content-Type': 'application/json',
    'x-user-id': user?.id?.toString() || 'user123',
    'x-user-email': user?.email || 'student@smartcampus.edu',
    'x-user-role': user?.role || 'USER',
  };
};

export const createBooking = async (bookingData) => {
  const response = await axios.post(API_URL, bookingData, { headers: getHeaders() });
  return response.data;
};

export const getMyBookings = async () => {
  const response = await axios.get(`${API_URL}/my-bookings`, { headers: getHeaders() });
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, { headers: getHeaders() });
  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/cancel`, {}, { headers: getHeaders() });
  return response.data;
};

export const reviewBooking = async (id, isApproved, adminRemarks = '', rejectionReason = '') => {
  const data = { isApproved, adminRemarks, rejectionReason };
  const response = await axios.put(`${API_URL}/${id}/review`, data, { headers: getHeaders() });
  return response.data;
};

export const checkInWithQRCode = async (qrToken) => {
  const response = await axios.post(`${API_URL}/check-in`, { qrToken }, { headers: getHeaders() });
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: getHeaders() });
  return response.data;
};
