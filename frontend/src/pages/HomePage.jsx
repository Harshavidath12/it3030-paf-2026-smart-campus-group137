import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../services/authService';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the logged-in user profile to get their name/email/icon
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (err) {
        console.error('Failed to load user', err);
        // If getting profile fails (e.g. token expired), send back to login
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
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: '#fff',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Navigation Bar */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
          🏛️ Smart Campus
        </div>

        {/* Profile Section - Top Right */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'User'}</span>
                <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Signed in</span>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {/* Google or generic Profile Icon */}
                <img 
                  src={user.profilePicture || "https://www.svgrepo.com/show/475656/google-color.svg"}
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <button 
                onClick={handleLogout}
                style={{
                  background: 'none',
                  border: '1px solid rgba(255,255,255,0.3)',
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  marginLeft: '10px'
                }}>
                Logout
              </button>
            </>
          ) : (
            <span>Loading profile...</span>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '10vh',
        gap: '20px'
      }}>
        <h1>Welcome to the Operations Hub!</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '600px', textAlign: 'center' }}>
          You have successfully authenticated via Google. This is the main dashboard for the Smart Campus system.
        </p>
        
        <button 
          onClick={() => navigate('/notifications')}
          style={{
            marginTop: '20px',
            background: '#6366f1',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
          }}>
          <span>🔔</span> View Notifications
        </button>
      </main>
    </div>
  );
};

export default HomePage;
