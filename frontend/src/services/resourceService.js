/**
 * resourceService.js
 * Handles API calls for the Facilities and Resource Management Catalogue.
 * Member 1 – Module A
 */

import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:8084/api/resources';

/**
 * Fetch all resources, optionally filtered by type and location.
 */
export const fetchResources = async (type = '', location = '', minCapacity = '') => {
  // Build query string
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (location) params.append('location', location);
  if (minCapacity) params.append('minCapacity', minCapacity);
  
  const queryString = params.toString() ? `?${params.toString()}` : '';
  
  const res = await axios.get(`${API_URL}${queryString}`, authHeader());
  return res.data;
};

/**
 * Fetch a single resource by its ID
 */
export const getResourceById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`, authHeader());
  return res.data;
};

/**
 * Create a new resource (Requires ADMIN role).
 */
export const createResource = async (resourceData) => {
  const res = await axios.post(API_URL, resourceData, authHeader());
  return res.data;
};

/**
 * Completely update an existing resource (Requires ADMIN role).
 */
export const updateResource = async (id, resourceData) => {
  const res = await axios.put(`${API_URL}/${id}`, resourceData, authHeader());
  return res.data;
};

/**
 * Update the status of a resource (ACTIVE, OUT_OF_SERVICE) (Requires ADMIN role).
 */
export const patchResourceStatus = async (id, status) => {
  const res = await axios.patch(`${API_URL}/${id}/status?status=${status}`, {}, authHeader());
  return res.data;
};

/**
 * Delete a resource completely (Requires ADMIN role).
 */
export const deleteResource = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, authHeader());
  return res.data;
};
