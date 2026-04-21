import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import NotificationPanel from './pages/NotificationPanel';
import NotificationPreferences from './pages/NotificationPreferences';
import HomePage from './pages/HomePage';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import MyBookings from './pages/MyBookings';
import CreateBooking from './pages/CreateBooking';
import AdminBookingsPage from './pages/AdminBookingsPage';
import QRCodeScanner from './components/bookings/QRCodeScanner';
import TicketingPage from './pages/TicketingPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { isLoggedIn, logout } from './services/authService';
import GlobalNavbar from './components/GlobalNavbar';

// Resources & Assets (Member 1)
import ResourceDiscoveryPage from './pages/resource/ResourceDiscoveryPage';
import ResourceDetailPage from './pages/resource/ResourceDetailPage';
import AdminResourceDashboard from './pages/resource/AdminResourceDashboard';

const BookingLayout = ({ children }) => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <GlobalNavbar />
    <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 2 }}>
      {children}
    </Box>
  </Box>
);

const AppContent = () => {
  const defaultRoute = isLoggedIn() ? '/' : '/login';

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth2/callback" element={<OAuthCallbackPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
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
        path="/about"
        element={
          <ProtectedRoute>
             <AboutUs />
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
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <BookingLayout>
              <MyBookings />
            </BookingLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/book"
        element={
          <ProtectedRoute>
            <BookingLayout>
              <CreateBooking />
            </BookingLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bookings"
        element={
          <ProtectedRoute>
            <BookingLayout>
              <AdminBookingsPage />
            </BookingLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/scanner"
        element={
          <ProtectedRoute>
            <BookingLayout>
              <Container maxWidth="md" sx={{ py: 4 }}>
                <QRCodeScanner />
              </Container>
            </BookingLayout>
          </ProtectedRoute>
        }
      />

      {/* Resources & Assets (Member 1) */}
      <Route
        path="/resources"
        element={
          <ProtectedRoute>
            <ResourceDiscoveryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources/:id"
        element={
          <ProtectedRoute>
            <ResourceDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/resources"
        element={
          <ProtectedRoute>
            <BookingLayout>
              <AdminResourceDashboard />
            </BookingLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={defaultRoute} replace />} />
    </Routes>
  );
};

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Router>
      <AppContent />
    </Router>
    <ToastContainer
      position="bottom-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="colored"
    />
  </ThemeProvider>
);

export default App;
