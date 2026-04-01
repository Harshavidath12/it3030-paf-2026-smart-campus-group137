import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import theme from './theme/theme';
import MyBookings from './pages/MyBookings';
import CreateBooking from './pages/CreateBooking';
import AdminBookingsPage from './pages/AdminBookingsPage';
import QRCodeScanner from './components/bookings/QRCodeScanner';

// Navigation bar component
const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = (path) => ({
    color: isActive(path) ? '#f59e0b' : 'rgba(255,255,255,0.8)',
    fontWeight: isActive(path) ? 700 : 500,
    borderBottom: isActive(path) ? '2px solid #f59e0b' : '2px solid transparent',
    borderRadius: 0,
    px: 2,
    '&:hover': { color: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
  });

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => navigate('/my-bookings')}>
          🎓 Smart Campus Hub
        </Typography>
        <Button sx={navButtonStyle('/my-bookings')} onClick={() => navigate('/my-bookings')}>
          My Bookings
        </Button>
        <Button sx={navButtonStyle('/book')} onClick={() => navigate('/book')}>
          New Booking
        </Button>
        <Button sx={navButtonStyle('/admin/bookings')} onClick={() => navigate('/admin/bookings')}>
          Admin Dashboard
        </Button>
        <Button sx={navButtonStyle('/scanner')} onClick={() => navigate('/scanner')}>
          QR Check-in
        </Button>
      </Toolbar>
    </AppBar>
  );
};

const AppContent = () => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', py: 2 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/my-bookings" />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/book" element={<CreateBooking />} />
          <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          <Route path="/scanner" element={
            <Container maxWidth="md" sx={{ py: 4 }}>
              <QRCodeScanner />
            </Container>
          } />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
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
};

export default App;
