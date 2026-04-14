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
      background: 'var(--bg-gradient)',
      color: 'var(--text-main)',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Navigation Bar */}
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
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Signed in</span>
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)'
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
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                Logout
              </button>
            </>
          ) : (
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>Loading profile...</span>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '15vh',
        gap: '20px'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}>Welcome to the Operations Hub!</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', textAlign: 'center', fontSize: '1.1rem', lineHeight: '1.6' }}>
          You have successfully authenticated via Google. This is the main dashboard for the Smart Campus system.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button 
            onClick={() => navigate('/resources')}
            style={{
              background: 'var(--primary-gradient)',
              color: '#fff',
              border: 'none',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🔍</span> Explore Catalogue
          </button>

          <button 
            onClick={() => navigate('/notifications')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '14px 28px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>🔔</span> View Notifications
          </button>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
