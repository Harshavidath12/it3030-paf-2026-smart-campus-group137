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

import HomePage           from './pages/HomePage';
import AdminDashboard     from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';

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
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/technician-dashboard"
          element={
            <ProtectedRoute>
              <TechnicianDashboard />
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
