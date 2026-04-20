import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMe, logout } from '../services/authService';
import GlobalNavbar from '../components/GlobalNavbar';
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
      <GlobalNavbar isDarkMode={isDarkMode} customUser={user} />

      {/* Main Content */}
      <main className="home-main">
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
