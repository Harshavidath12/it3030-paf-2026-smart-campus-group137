/**
 * NotificationDropdown.jsx
 * Dropdown list of notifications with mark-as-read and dismiss actions.
 * Member 04 – Module D: Notifications
 */

import React, { useState, useEffect } from 'react';
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from '../services/notificationService';
import './NotificationDropdown.css';

const typeLabel = {
  BOOKING_APPROVED:  '✅ Booking Approved',
  BOOKING_REJECTED:  '❌ Booking Rejected',
  TICKET_UPDATE:     '🔧 Ticket Update',
  COMMENT:           '💬 Comment',
  GENERAL:           'ℹ️ General',
};

const NotificationDropdown = ({ onRead, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (e) {
        console.error('Could not load notifications', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    onRead();
  };

  const handleDismiss = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    onRead();
  };

  return (
    <div className="notif-dropdown" id="notification-dropdown">
      <div className="notif-header">
        <span>Notifications</span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      {loading && <p className="notif-empty">Loading…</p>}

      {!loading && notifications.length === 0 && (
        <p className="notif-empty">You're all caught up 🎉</p>
      )}

      <ul className="notif-list">
        {notifications.map((n) => (
          <li key={n.id} className={`notif-item ${n.isRead ? 'read' : 'unread'}`}>
            <div className="notif-type">{typeLabel[n.type] || n.type}</div>
            <p className="notif-message">{n.message}</p>
            <div className="notif-actions">
              {!n.isRead && (
                <button
                  className="action-read"
                  onClick={() => handleMarkAsRead(n.id)}
                  id={`mark-read-${n.id}`}
                >
                  Mark read
                </button>
              )}
              <button
                className="action-dismiss"
                onClick={() => handleDismiss(n.id)}
                id={`dismiss-${n.id}`}
              >
                Dismiss
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
