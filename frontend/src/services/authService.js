/**
 * authService.js
 * Handles authentication API calls and JWT token management.
 * Member 04 – Module E: Authentication
 */

import axios from 'axios';

const API_URL = 'http://localhost:8084/api/auth';
const TOKEN_KEY = 'smartcampus_token';

// ── Token helpers ──────────────────────────────────────────

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const isLoggedIn = () => !!getToken();

// ── Auth header helper ─────────────────────────────────────

export const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

// ── API calls ──────────────────────────────────────────────

/**
 * Register a new local account.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token, userId, name, email, role}>}
 */
export const register = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  // Token is deliberately not saved here so the user has to login manually
  return res.data;
};

/**
 * Login with email and password.
 * @returns {Promise<{token, userId, name, email, role}>}
 */
export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  saveToken(res.data.token);
  return res.data;
};

/**
 * Get the current authenticated user profile.
 */
export const getMe = async () => {
  const res = await axios.get(`${API_URL}/me`, authHeader());
  return res.data;
};

/**
 * Logout – remove token from storage.
 */
export const logout = () => removeToken();

/**
 * Trigger Google OAuth2 login – redirects to Spring Boot OAuth flow.
 */
export const loginWithGoogle = () => {
  window.location.href = 'http://localhost:8084/oauth2/authorization/google';
};

/**
 * Fetch all users (Admin only)
 */
export const getAllUsers = async () => {
  const res = await axios.get(`http://localhost:8084/api/users/roles`, authHeader());
  return res.data;
};

/**
 * Admin: Create a user and immediately assign a specific role.
 */
export const adminCreateUser = async (name, email, password, role) => {
  const regRes = await axios.post(`${API_URL}/register`, { name, email, password });
  const newUserId = regRes.data.userId;
  
  const roleRes = await axios.put(
    `http://localhost:8084/api/users/${newUserId}/role`,
    { role },
    authHeader()
  );
  return roleRes.data;
};

