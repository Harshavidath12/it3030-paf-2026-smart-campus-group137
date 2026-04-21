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
import NotificationPreferences from './pages/NotificationPreferences';
import ProtectedRoute     from './components/ProtectedRoute';

import HomePage           from './pages/HomePage';
import AdminDashboard     from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import TicketingPage        from './pages/TicketingPage';
import MyTicketsPage        from './pages/MyTicketsPage';

// Member 1: Facilities & Assets Catalogue
import ResourceDiscoveryPage from './pages/resource/ResourceDiscoveryPage';
import ResourceDetailPage    from './pages/resource/ResourceDetailPage';
import AdminResourceDashboard from './pages/resource/AdminResourceDashboard';

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
          path="/notification-preferences"
          element={
            <ProtectedRoute>
              <NotificationPreferences />
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
        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <TicketingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTicketsPage />
            </ProtectedRoute>
          }
        />

        {/* Member 1: Facilities & Assets Routes */}
        <Route 
          path="/resources" 
          element={<ProtectedRoute><ResourceDiscoveryPage /></ProtectedRoute>} 
        />
        <Route 
          path="/resources/:id" 
          element={<ProtectedRoute><ResourceDetailPage /></ProtectedRoute>} 
        />
        <Route 
          path="/admin/resources" 
          element={<ProtectedRoute><AdminResourceDashboard /></ProtectedRoute>} 
        />


        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
