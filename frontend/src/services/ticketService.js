import axios from 'axios';

const API_URL = '/api/tickets';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const createTicket = async (ticketData) => {
  const response = await axios.post(API_URL, ticketData, getAuthHeaders());
  return response.data;
};

export const getMyTickets = async () => {
  const response = await axios.get(`${API_URL}/my`, getAuthHeaders());
  return response.data;
};

export const getAllTickets = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const updateTicket = async (id, updateData) => {
  const response = await axios.put(`${API_URL}/${id}`, updateData, getAuthHeaders());
  return response.data;
};
