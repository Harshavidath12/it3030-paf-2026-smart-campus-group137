import axios from 'axios';
import { getStoredUser } from './authService';

const API_URL = 'http://localhost:8085/api/bookings/admin';

const adminHeaders = () => {
  const user = getStoredUser();

  return {
    'Content-Type': 'application/json',
    'x-user-id': user?.id?.toString() || 'admin_manager_01',
    'x-user-email': user?.email || '',
    'x-user-role': user?.role || 'ADMIN',
  };
};

export const fetchAdminBookings = async (statusFilter = '') => {
  const url = statusFilter ? `${API_URL}?status=${statusFilter}` : API_URL;
  const response = await axios.get(url, { headers: adminHeaders() });
  return response.data;
};

export const approveBooking = async (id, remarks) => {
  const response = await axios.patch(`${API_URL}/${id}/approve`, { remarks }, { headers: adminHeaders() });
  return response.data;
};

export const rejectBooking = async (id, remarks) => {
  const response = await axios.patch(`${API_URL}/${id}/reject`, { remarks }, { headers: adminHeaders() });
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { headers: adminHeaders() });
  return response.data;
};
