/**
 * notificationService.js
 * API calls for the Notifications module.
 * Member 04 – Module D: Notifications
 */

import axios from 'axios';
import { authHeader } from './authService';

const API_URL = 'http://localhost:8085/api/notifications';

/** Get all notifications for the current user (newest first). */
export const getNotifications = async () => {
  const res = await axios.get(API_URL, authHeader());
  return res.data;
};

/** Get the count of unread notifications. */
export const getUnreadCount = async () => {
  const res = await axios.get(`${API_URL}/unread-count`, authHeader());
  return res.data.unreadCount;
};

/** Mark a specific notification as read. */
export const markAsRead = async (id) => {
  const res = await axios.patch(`${API_URL}/${id}/read`, {}, authHeader());
  return res.data;
};

/** Delete a notification. */
export const deleteNotification = async (id) => {
  await axios.delete(`${API_URL}/${id}`, authHeader());
};

const PREFS_API_URL = 'http://localhost:8085/api/notification-preferences';

/** Get notification preferences for the current user. */
export const getNotificationPreferences = async () => {
  const res = await axios.get(PREFS_API_URL, authHeader());
  return res.data;
};

/** Update notification preferences for the current user. */
export const updateNotificationPreferences = async (preferences) => {
  const res = await axios.put(PREFS_API_URL, preferences, authHeader());
  return res.data;
};
