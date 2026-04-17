import axios from 'axios';

const API_URL = 'http://localhost:8084/api/auth';
const TOKEN_KEY = 'smartcampus_token';
const USER_KEY = 'smartcampus_user';

export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const saveUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));
export const getStoredUser = () => {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
};
export const removeStoredUser = () => localStorage.removeItem(USER_KEY);
export const isLoggedIn = () => !!getToken();

export const authHeader = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const register = async (name, email, password) => {
  const res = await axios.post(`${API_URL}/register`, { name, email, password });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, { email, password });
  saveToken(res.data.token);
  saveUser({
    id: res.data.userId,
    name: res.data.name,
    email: res.data.email,
    role: res.data.role,
  });
  return res.data;
};

export const getMe = async () => {
  const res = await axios.get(`${API_URL}/me`, authHeader());
  saveUser(res.data);
  return res.data;
};

export const logout = () => {
  removeToken();
  removeStoredUser();
};

export const loginWithGoogle = () => {
  window.location.href = 'http://localhost:8084/oauth2/authorization/google';
};

export const getAllUsers = async () => {
  const res = await axios.get('http://localhost:8084/api/users/roles', authHeader());
  return res.data;
};

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
