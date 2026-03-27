/**
 * OAuthCallbackPage.jsx
 * Handles the redirect from the backend after Google OAuth2 login.
 * Extracts the JWT from the URL and stores it, then navigates home.
 * Member 04 – Module E: OAuth Integration
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToken } from '../services/authService';

const OAuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      saveToken(token);
      navigate('/', { replace: true });
    } else {
      // Something went wrong with OAuth flow
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      color: '#fff',
      fontFamily: 'Inter, sans-serif',
      fontSize: '1rem',
    }}>
      <p>Completing sign-in with Google…</p>
    </div>
  );
};

export default OAuthCallbackPage;
