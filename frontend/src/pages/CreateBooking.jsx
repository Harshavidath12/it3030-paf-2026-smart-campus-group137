import React from 'react';
import BookingForm from '../components/bookings/BookingForm';
import { Container, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const CreateBooking = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box mb={2}>
        <Button 
          variant="contained" 
          startIcon={<ArrowBack />}
          onClick={() => navigate('/my-bookings')}
          sx={{ 
            bgcolor: 'white', 
            color: '#4f46e5', 
            fontWeight: '800',
            borderRadius: '12px',
            px: 3,
            py: 1,
            boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            '&:hover': { bgcolor: '#f8fafc', transform: 'translateY(-2px)' },
            transition: 'all 0.3s',
            textTransform: 'none'
          }}
        >
          Back to My Bookings
        </Button>
      </Box>
      <BookingForm />
    </Container>
  );
};

export default CreateBooking;
