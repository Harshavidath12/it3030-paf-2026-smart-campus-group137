import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:8084/api/tickets';

export const createTicket = async (ticketData) => {
  const response = await axios.post(API_URL, ticketData, authHeader());
  return response.data;
};

export const getMyTickets = async () => {
  const response = await axios.get(`${API_URL}/my`, authHeader());
  return response.data;
};

export const getAllTickets = async () => {
  const response = await axios.get(API_URL, authHeader());
  return response.data;
};

export const updateTicket = async (id, updateData) => {
  const response = await axios.put(`${API_URL}/${id}`, updateData, authHeader());
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, authHeader());
  return response.data;
};
