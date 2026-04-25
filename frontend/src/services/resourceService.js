import axios from 'axios';
import { getToken } from './authService';

const API_URL = 'http://localhost:8085/api/resources';

// Helper to get auth header
const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllResources = async (params = {}) => {
  const response = await axios.get(API_URL, { 
    headers: getAuthHeader(),
    params 
  });
  return response.data;
};

export const getResourceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, { 
    headers: getAuthHeader() 
  });
  return response.data;
};

export const createResource = async (resourceData) => {
  const response = await axios.post(API_URL, resourceData, { 
    headers: getAuthHeader() 
  });
  return response.data;
};

export const updateResource = async (id, resourceData) => {
  const response = await axios.put(`${API_URL}/${id}`, resourceData, { 
    headers: getAuthHeader() 
  });
  return response.data;
};

export const updateResourceStatus = async (id, status) => {
  const response = await axios.patch(`${API_URL}/${id}/status`, null, { 
    headers: getAuthHeader(),
    params: { status }
  });
  return response.data;
};

export const deleteResource = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, { 
    headers: getAuthHeader() 
  });
  return response.data;
};
