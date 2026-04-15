/**
 * NotificationPanel.jsx
 * Full-page notification centre accessible at /notifications.
 * Member 04 – Module D: Notifications
 */

import React, { useState, useEffect } from 'react';
import {
  getNotifications,
  markAsRead,
  deleteNotification,
} from '../services/notificationService';
import { logout } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './NotificationPanel.css';

const typeLabel = {
  BOOKING_APPROVED:  '✅ Booking Approved',
  BOOKING_REJECTED:  '❌ Booking Rejected',
  TICKET_UPDATE:     '🔧 Ticket Update',
  COMMENT:           '💬 Comment',
  GENERAL:           'ℹ️ General',
};

const NotificationPanel = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL'); // ALL | UNREAD

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDismiss = async (id) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => markAsRead(n.id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const displayed = filter === 'UNREAD'
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="np-page">
      {/* Minimal navbar */}
      <nav className="np-nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span className="np-nav-brand">🏛️ Smart Campus</span>
          <span 
            onClick={() => navigate('/contact')}
            className="nav-link-text"
          >
            Contact Us
          </span>
        </div>
        <div className="np-nav-actions">
          <button className="np-btn-secondary" onClick={() => navigate('/')}>← Home</button>
          <button className="np-btn-secondary" onClick={() => { logout(); navigate('/login'); }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="np-container">
        <div className="np-header">
          <h1 className="np-title">
            Notifications
            {unreadCount > 0 && (
              <span className="np-count-badge">{unreadCount} unread</span>
            )}
          </h1>
          <div className="np-controls">
            <div className="np-filter-tabs">
              <button
                className={filter === 'ALL' ? 'tab active' : 'tab'}
                onClick={() => setFilter('ALL')}
                id="filter-all"
              >All</button>
              <button
                className={filter === 'UNREAD' ? 'tab active' : 'tab'}
                onClick={() => setFilter('UNREAD')}
                id="filter-unread"
              >Unread</button>
            </div>
            {unreadCount > 0 && (
              <button className="np-btn-primary" onClick={handleMarkAllRead} id="mark-all-read">
                Mark all read
              </button>
            )}
          </div>
        </div>

        {loading && <p className="np-empty">Loading notifications…</p>}

        {!loading && displayed.length === 0 && (
          <div className="np-empty-state">
            <div className="np-empty-icon">🔔</div>
            <p>{filter === 'UNREAD' ? 'No unread notifications.' : "You're all caught up!"}</p>
          </div>
        )}

        <ul className="np-list">
          {displayed.map((n) => (
            <li key={n.id} className={`np-item ${n.isRead ? 'read' : 'unread'}`}>
              <div className="np-item-header">
                <span className="np-type-badge">{typeLabel[n.type] || n.type}</span>
                <span className="np-date">
                  {new Date(n.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="np-message">{n.message}</p>
              <div className="np-item-actions">
                {!n.isRead && (
                  <button
                    className="np-action-read"
                    onClick={() => handleMarkAsRead(n.id)}
                    id={`np-mark-read-${n.id}`}
                  >
                    ✓ Mark as read
                  </button>
                )}
                <button
                  className="np-action-dismiss"
                  onClick={() => handleDismiss(n.id)}
                  id={`np-dismiss-${n.id}`}
                >
                  🗑 Dismiss
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPanel;
