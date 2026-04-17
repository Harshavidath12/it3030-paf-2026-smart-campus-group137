import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import NotificationPanel from './pages/NotificationPanel';
import HomePage from './pages/HomePage';
import AdminDashboard from './pages/AdminDashboard';
import TechnicianDashboard from './pages/TechnicianDashboard';
import MyBookings from './pages/MyBookings';
import CreateBooking from './pages/CreateBooking';
import AdminBookingsPage from './pages/AdminBookingsPage';
import QRCodeScanner from './components/bookings/QRCodeScanner';
import TicketingPage from './pages/TicketingPage';
import MyTicketsPage from './pages/MyTicketsPage';
import ProtectedRoute from './components/ProtectedRoute';
import { getStoredUser, isLoggedIn, logout } from './services/authService';
import NotificationBell from './components/NotificationBell';

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = (path) => ({
    color: isActive(path) ? '#f59e0b' : 'rgba(255,255,255,0.8)',
    fontWeight: isActive(path) ? 700 : 500,
    borderBottom: isActive(path) ? '2px solid #f59e0b' : '2px solid transparent',
    borderRadius: 0,
    px: 2,
    '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  });

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Smart Campus Hub
        </Typography>
        <Button sx={navButtonStyle('/')} onClick={() => navigate('/')}>
          Home
        </Button>
        <Button sx={navButtonStyle('/my-bookings')} onClick={() => navigate('/my-bookings')}>
          Booking Facility
        </Button>
        <Button sx={navButtonStyle('/book')} onClick={() => navigate('/book')}>
          New Booking
        </Button>
        {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
          <Button sx={navButtonStyle('/admin/bookings')} onClick={() => navigate('/admin/bookings')}>
            Booking Management
          </Button>
        )}
        <Button sx={navButtonStyle('/scanner')} onClick={() => navigate('/scanner')}>
          QR Check-in
        </Button>
        <NotificationBell />
        <Button sx={{ ml: 1, color: 'rgba(255,255,255,0.8)' }} onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const BookingLayout = ({ children }) => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <NavBar />
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
