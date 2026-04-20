import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../services/authService';
import NotificationBell from '../components/NotificationBell';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

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
        background: isDarkMode ? '#0f172a' : 'var(--bg-gradient)',
        color: isDarkMode ? '#f1f5f9' : 'var(--text-main)',
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.3s, color 0.3s'
      }}
    >
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: isDarkMode ? '#020617' : 'var(--bg-gradient-header)',
          color: 'var(--text-header)',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          transition: 'background 0.3s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold', transform: 'translateY(-2px)' }}>
            Smart Campus
          </div>
          <span onClick={() => navigate('/resources')} className="nav-link-text">
            Explore Catalogue
          </span>
          <span onClick={() => navigate('/my-bookings')} className="nav-link-text">
            Booking Facility
          </span>
          <span onClick={() => navigate('/contact')} className="nav-link-text">
            Contact Us
          </span>
          <span onClick={() => navigate('/about')} className="nav-link-text">
            About Us
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
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
                  background: '#ef4444',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  marginLeft: '10px',
                  fontWeight: '600',
                  transition: 'background 0.2s, transform 0.2s',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = '#dc2626';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = '#ef4444';
                  e.currentTarget.style.transform = 'translateY(0)';
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
        <div className="left-sidebar" style={{ background: isDarkMode ? 'rgba(30,30,40,0.9)' : 'rgba(255, 255, 255, 0.9)' }}>
          <div className="sidebar-group">
            <span className="sidebar-text" onClick={() => setIsDarkMode(false)} style={{ color: isDarkMode ? '#888' : (isDarkMode ? '#888' : '#333') }}>Light</span>
            <span className="sidebar-icon" onClick={() => setIsDarkMode(!isDarkMode)} style={{ cursor: 'pointer' }}>{isDarkMode ? '🌙' : '🔆'}</span>
            <span className="sidebar-text" onClick={() => setIsDarkMode(true)} style={{ color: isDarkMode ? '#fff' : '#888' }}>Dark</span>
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
            <button className="read-story-btn" onClick={() => navigate('/about')}>Read Full Story &rarr;</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
