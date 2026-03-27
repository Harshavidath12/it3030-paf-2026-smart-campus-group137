/**
 * App.js – Main router
 * Member 04: Routes for Module D (Notifications) and Module E (Auth/OAuth)
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import OAuthCallbackPage  from './pages/OAuthCallbackPage';
import NotificationPanel  from './pages/NotificationPanel';
import ProtectedRoute     from './components/ProtectedRoute';

/** Placeholder home page – other team members will fill this in */
const HomePage = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    color: '#fff', fontFamily: 'Inter, sans-serif', gap: 16
  }}>
    <h1>🏛️ Smart Campus</h1>
    <p style={{ color: 'rgba(255,255,255,0.6)' }}>Operations Hub – Welcome!</p>
    <a href="/notifications"
       style={{ color: '#a5b4fc', textDecoration: 'none', fontSize: '0.9rem' }}>
      🔔 View Notifications
    </a>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* ── Public routes ── */}
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<RegisterPage />} />
        <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

        {/* ── Protected routes ── */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationPanel />
            </ProtectedRoute>
          }
        />

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
