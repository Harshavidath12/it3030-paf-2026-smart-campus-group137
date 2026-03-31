import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../services/authService';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user profile to get their name/email/icon
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        if (userData.role !== 'TECHNICIAN') {
          navigate('/'); // Redirect non-technicians
        } else {
          setUser(userData);
        }
      } catch (err) {
        console.error('Failed to load user', err);
        logout();
        navigate('/login', { replace: true });
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      color: 'var(--text-main)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'var(--bg-gradient-header)',
        color: 'var(--text-header)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
          🛠️ Smart Campus - Technician Hub
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'Technician'}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Tech Role</span>
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'var(--text-header)',
                  padding: '6px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  marginLeft: '10px',
                  fontWeight: '500',
                  transition: 'background 0.2s'
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Loading profile...</span>
          )}
        </div>
      </nav>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '15vh',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>Technician Workspace</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', textAlign: 'center', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Welcome to your workspace. Here you can view pending tickets, update repair statuses, and manage equipment.
        </p>
      </main>
    </div>
  );
};

export default TechnicianDashboard;
