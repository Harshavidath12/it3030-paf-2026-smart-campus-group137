import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../services/authService';
import NotificationBell from '../components/NotificationBell';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
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

  const primaryButtonStyle = {
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
    transition: 'all 0.2s ease',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
        color: 'var(--text-main)',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: 'var(--bg-gradient-header)',
          color: 'var(--text-header)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', transform: 'translateY(-2px)' }}>
            Smart Campus
          </div>
          <span onClick={() => navigate('/contact')} className="nav-link-text">
            Contact Us
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <button
            onClick={() => navigate('/resources')}
            style={{
              background: 'var(--primary-gradient)',
              border: 'none',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Explore Catalogue
          </button>
          <button
            onClick={() => navigate('/my-bookings')}
            style={{
              background: 'var(--primary-gradient)',
              border: 'none',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            Booking Facility
          </button>
          {user ? (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{user.name || 'User'}</span>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Signed in</span>
              </div>
              <NotificationBell />
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <img
                  src={user.profilePicture || 'https://www.svgrepo.com/show/475656/google-color.svg'}
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
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
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

      {/* Main Content */}
      <main className="home-main">
        {/* Left floating bar */}
        <div className="left-sidebar">
          <div className="sidebar-group">
            <span className="sidebar-text">Light</span>
            <span className="sidebar-icon">🔆</span>
            <span className="sidebar-text" style={{ color: '#888' }}>Dark</span>
          </div>
          <div className="sidebar-divider"></div>
          <div className="sidebar-scroll" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="sidebar-icon">↑</span>
            <span className="sidebar-text scroll-text">Scroll to top</span>
          </div>
        </div>

        {/* Section 1: Hero */}
        <section className="hero-section">
          <h2 className="hero-subtitle">BUILD YOUR FUTURE AT</h2>
          <h1 className="hero-title">SMART CAMPUS</h1>
          <div className="hero-bottom-actions">
            <button className="hero-cta-btn" onClick={() => navigate('/resources')}>Explore Catalogue</button>
          </div>
        </section>

        {/* Section 2: Info Grid */}
        <section className="info-section">
          <div className="info-left">
            <h2 className="info-title">
              Smart Campus is the premier network of modern educational facilities with over 15,000+ students and over 1,200+ top-tier educators growing every day!
            </h2>
          </div>
          <div className="info-right">
            <div className="info-box">
              <p className="info-box-title">At Smart Campus you can:</p>
              <ul className="info-box-list">
                <li>Learn from skilled and talented teachers.</li>
                <li>Receive top-tier educational certificates.</li>
                <li>Achieve your utmost potential.</li>
                <li>Be a part of a community of inspired, intellectual and talented individuals.</li>
              </ul>
              <p className="info-box-footer">We utilize the best practices available in teaching to develop the skills required for success in higher education.</p>
            </div>
          </div>
        </section>

        {/* Section 3: About Us */}
        <section className="about-section">
          <div className="about-footer-bar">
            <div className="about-text-content">
              <h2 className="about-title">About Smart Campus</h2>
              <p className="about-desc">
                Smart Campus is an innovative educational platform designed to provide students with state-of-the-art learning experiences, seamlessly blending technology with education.
              </p>
            </div>
            <button className="read-story-btn">Read Full Story &rarr;</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
