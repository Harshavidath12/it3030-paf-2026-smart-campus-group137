import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Grid } from '@mui/material';
import { getMyBookings, cancelBooking } from '../../services/bookingService';
import BookingCard from './BookingCard';
import { toast } from 'react-toastify';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings. Make sure the backend is running on port 8084.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await cancelBooking(id);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the list
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel booking';
      toast.error(msg);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={6}>
        <CircularProgress sx={{ color: '#4f46e5' }} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color: '#1e1b4b', mb: 3 }}>
        📚 My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Box sx={{
          textAlign: 'center', py: 8, px: 4,
          background: 'rgba(255,255,255,0.8)',
          borderRadius: 4, backdropFilter: 'blur(10px)'
        }}>
          <Typography variant="h6" color="text.secondary">
            No bookings found. Create your first booking! 🎯
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking.id}>
              <BookingCard booking={booking} onCancel={handleCancel} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default BookingList;
