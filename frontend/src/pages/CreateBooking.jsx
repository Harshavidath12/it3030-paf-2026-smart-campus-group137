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
        <Button variant="text" startIcon={<ArrowBack />}
          onClick={() => navigate('/my-bookings')}
          sx={{ color: '#4f46e5' }}
        >
          Back to My Bookings
        </Button>
      </Box>
      <BookingForm />
    </Container>
  );
};

export default CreateBooking;
