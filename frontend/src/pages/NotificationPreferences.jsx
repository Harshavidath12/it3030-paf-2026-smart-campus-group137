import React, { useState, useEffect } from 'react';
import { getNotificationPreferences, updateNotificationPreferences } from '../services/notificationService';
import './NotificationPreferences.css';

const NotificationPreferences = () => {
  const [preferences, setPreferences] = useState({
    disableAll: false,
    bookingWebEnabled: true,
    ticketWebEnabled: true,
    generalWebEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const data = await getNotificationPreferences();
        setPreferences({
          disableAll: data.disableAll || false,
          bookingWebEnabled: data.bookingWebEnabled !== false, // default true if undefined
          ticketWebEnabled: data.ticketWebEnabled !== false,
          generalWebEnabled: data.generalWebEnabled !== false,
        });
      } catch (error) {
        console.error("Failed to fetch preferences", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrefs();
  }, []);

  const handleToggle = async (field) => {
    if (saving) return;
    
    // Optimistic update
    const newPrefs = {
      ...preferences,
      [field]: !preferences[field]
    };
    setPreferences(newPrefs);

    try {
        setSaving(true);
        await updateNotificationPreferences(newPrefs);
    } catch (error) {
        console.error("Failed to update preferences", error);
        // Revert on failure
        setPreferences(preferences);
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
      return <div className="pref-loading">Loading preferences...</div>;
  }

  return (
    <div className="pref-container">
      <h1 className="pref-title">Notification preferences</h1>
      
      <div className="pref-disable-all">
        <label className="pref-checkbox-label">
          <input 
            type="checkbox" 
            checked={preferences.disableAll} 
            onChange={() => handleToggle('disableAll')}
            disabled={saving}
          />
          Disable notifications
        </label>
      </div>

      <div className={`pref-table-container ${preferences.disableAll ? 'disabled-op' : ''}`}>
        <table className="pref-table">
          <thead>
            <tr>
              <th className="th-feature"></th>
              <th className="th-toggle">Web</th>
            </tr>
          </thead>
          <tbody>
            {/* Bookings Section */}
            <tr className="pref-section-header">
              <td colSpan="2">Bookings</td>
            </tr>
            <tr className="pref-row">
              <td>Booking notifications</td>
              <td className="td-toggle">
                <ToggleSwitch 
                  checked={preferences.bookingWebEnabled} 
                  onChange={() => handleToggle('bookingWebEnabled')} 
                  disabled={preferences.disableAll || saving}
                />
              </td>
            </tr>

            {/* Tickets Section */}
            <tr className="pref-section-header">
              <td colSpan="2">Tickets</td>
            </tr>
            <tr className="pref-row">
              <td>Ticket updates</td>
              <td className="td-toggle">
                <ToggleSwitch 
                  checked={preferences.ticketWebEnabled} 
                  onChange={() => handleToggle('ticketWebEnabled')} 
                  disabled={preferences.disableAll || saving}
                />
              </td>
            </tr>

            {/* General Section */}
            <tr className="pref-section-header">
              <td colSpan="2">General</td>
            </tr>
            <tr className="pref-row">
              <td>General announcements</td>
              <td className="td-toggle">
                <ToggleSwitch 
                  checked={preferences.generalWebEnabled} 
                  onChange={() => handleToggle('generalWebEnabled')} 
                  disabled={preferences.disableAll || saving}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper component for the toggle switch
const ToggleSwitch = ({ checked, onChange, disabled }) => {
  return (
    <label className={`toggle-switch ${disabled ? 'disabled' : ''}`}>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange}
        disabled={disabled}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default NotificationPreferences;
