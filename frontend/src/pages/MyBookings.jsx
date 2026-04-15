import React from 'react';
import BookingList from '../components/bookings/BookingList';
import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';

const MyBookings = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => navigate('/book')}
          sx={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#fff', fontWeight: 'bold',
            '&:hover': { background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)' }
          }}
        >
          New Booking
        </Button>
      </Box>
      <BookingList />
    </Container>
  );
};

export default MyBookings;
