import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper,
  Grid, CircularProgress, Alert, InputAdornment
} from '@mui/material';
import {
  EventNote, AccessTime, People, Description, MeetingRoom
} from '@mui/icons-material';
import { createBooking } from '../../services/bookingService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    resourceId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createBooking({
        resourceId: parseInt(formData.resourceId),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime + ':00',
        endTime: formData.endTime + ':00',
        purpose: formData.purpose,
        expectedAttendees: parseInt(formData.expectedAttendees)
      });
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Conflict: ' + err.response.data.message);
      } else if (err.response?.status === 400) {
        const data = err.response.data;
        if (data.fieldErrors) {
          setError('Validation: ' + Object.values(data.fieldErrors).join(', '));
        } else {
          setError(data.message || 'Validation error');
        }
      } else {
        setError('Failed to create booking. Make sure the backend is running on port 8084.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 5, maxWidth: 650, mx: 'auto', mt: 4, borderRadius: 4,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#1e1b4b', mb: 3 }}>
        📋 Request a New Booking
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Resource ID" name="resourceId" type="number"
              value={formData.resourceId} onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><MeetingRoom color="primary" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Booking Date" name="bookingDate" type="date"
              InputLabelProps={{ shrink: true }} value={formData.bookingDate}
              onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><EventNote color="primary" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Start Time" name="startTime" type="time"
              InputLabelProps={{ shrink: true }} value={formData.startTime}
              onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><AccessTime color="primary" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="End Time" name="endTime" type="time"
              InputLabelProps={{ shrink: true }} value={formData.endTime}
              onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><AccessTime color="primary" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Purpose" name="purpose" multiline rows={3}
              value={formData.purpose} onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><Description color="primary" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Expected Attendees" name="expectedAttendees"
              type="number" value={formData.expectedAttendees} onChange={handleChange}
              required inputProps={{ min: 1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><People color="primary" /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large" fullWidth
              disabled={loading}
              sx={{
                py: 1.5, mt: 1, fontSize: '1rem',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '🚀 Submit Booking Request'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BookingForm;
