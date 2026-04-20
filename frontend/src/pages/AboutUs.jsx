import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalNavbar from '../components/GlobalNavbar';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-gradient)',
      color: 'var(--text-main)',
      fontFamily: 'Inter, sans-serif',
    }}>
      <GlobalNavbar />
      
      <main style={{ padding: '4rem 2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem', color: '#1e1b4b' }}>About Smart Campus</h1>
        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#475569', marginBottom: '2rem' }}>
          Smart Campus is an innovative educational platform designed to provide students with state-of-the-art learning experiences, seamlessly blending technology with education. Our mission is to foster a community of inspired, intellectual, and talented individuals.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)', flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#4f46e5' }}>Our Vision</h3>
            <p style={{ color: '#475569' }}>To be the premier network for modern educational facilities, empowering over 15,000+ students globally.</p>
          </div>
          <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: 'var(--shadow-md)', flex: 1 }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#4f46e5' }}>Our Mission</h3>
            <p style={{ color: '#475569' }}>Utilizing the best practices in teaching to develop skills required for success in higher education and beyond.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutUs;
