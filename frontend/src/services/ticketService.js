import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:8085/api/tickets';

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

// Comment Service endpoints
export const getCommentsByTicket = async (ticketId) => {
  const response = await axios.get(`${API_URL}/${ticketId}/comments`, authHeader());
  return response.data;
};

export const addComment = async (ticketId, content) => {
  const response = await axios.post(`${API_URL}/${ticketId}/comments`, { content }, authHeader());
  return response.data;
};

export const updateComment = async (ticketId, commentId, content) => {
  const response = await axios.put(`${API_URL}/${ticketId}/comments/${commentId}`, { content }, authHeader());
  return response.data;
};

export const deleteComment = async (ticketId, commentId) => {
  const response = await axios.delete(`${API_URL}/${ticketId}/comments/${commentId}`, authHeader());
  return response.data;
};

