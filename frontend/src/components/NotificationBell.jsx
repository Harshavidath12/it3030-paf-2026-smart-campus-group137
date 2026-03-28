/**
 * NotificationBell.jsx
 * Bell icon in navbar showing the unread notification badge.
 * Clicking it opens/closes the notification dropdown.
 * Member 04 – Module D: Notifications
 */

import React, { useState, useEffect, useRef } from 'react';
import { getUnreadCount } from '../services/notificationService';
import NotificationDropdown from './NotificationDropdown';
import './NotificationBell.css';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount]   = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef(null);

  const fetchUnread = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (e) { /* silently fail – user may have no token yet */ }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // poll every 30 s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen) fetchUnread();
  };

  return (
    <div className="notification-bell-wrapper" ref={bellRef}>
      <button
        className="bell-btn"
        onClick={handleBellClick}
        aria-label="Notifications"
        id="notification-bell-btn"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
          <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2zm6-6V11a6 6 0 0 0-5-5.91V4a1 1 0 0 0-2 0v1.09A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
        {unreadCount > 0 && (
          <span className="badge" id="unread-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {dropdownOpen && (
        <NotificationDropdown
          onRead={fetchUnread}
          onClose={() => setDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default NotificationBell;
