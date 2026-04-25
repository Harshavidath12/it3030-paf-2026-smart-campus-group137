import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Paper,
  Grid, CircularProgress, Alert, InputAdornment,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  EventNote, AccessTime, People, Description, MeetingRoom
} from '@mui/icons-material';
import { createBooking } from '../../services/bookingService';
import { getAllResources } from '../../services/resourceService';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];
  const [loading, setLoading] = useState(false);
  const [fetchingResources, setFetchingResources] = useState(false);
  const [resources, setResources] = useState([]);
  const [error, setError] = useState(null);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initialResourceId = queryParams.get('resourceId') || '';

  const [formData, setFormData] = useState({
    resourceId: initialResourceId,
    bookingDate: '',
    startTime: '',
    endTime: '',
    purpose: '',
    expectedAttendees: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchResources = async () => {
      setFetchingResources(true);
      try {
        const data = await getAllResources({ status: 'ACTIVE' });
        setResources(data);
      } catch (err) {
        console.error("Failed to load resources for dropdown", err);
      } finally {
        setFetchingResources(false);
      }
    };
    fetchResources();
  }, []);

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
        setError('Failed to create booking. Make sure the backend is running on port 8085.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots (every 30 mins)
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of ['00', '30']) {
      const h24 = hour.toString().padStart(2, '0');
      const h12 = hour % 12 || 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      timeSlots.push({
        value: `${h24}:${min}`,
        label: `${h12}:${min} ${ampm}`
      });
    }
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 5, maxWidth: 800, mx: 'auto', mt: 4, borderRadius: 4,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99, 102, 241, 0.1)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
      }}
    >
      <Typography variant="h5" gutterBottom sx={{ color: '#1e1b4b', fontWeight: 800, mb: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <span style={{ fontSize: '1.4rem' }}>📋</span> Request a New Booking
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Row 1: Resource and Date */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required disabled={!!initialResourceId}>
              <InputLabel>Resource ID</InputLabel>
              <Select
                name="resourceId"
                value={formData.resourceId}
                label="Resource ID"
                onChange={handleChange}
                startAdornment={<InputAdornment position="start" sx={{mr: 1}}><MeetingRoom sx={{ color: '#4f46e5' }} /></InputAdornment>}
                sx={{ borderRadius: '12px' }}
              >
                {fetchingResources ? (
                  <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                ) : resources.length === 0 && !initialResourceId ? (
                  <MenuItem disabled>No active resources found</MenuItem>
                ) : (
                  resources.map(res => (
                    <MenuItem key={res.id} value={res.id.toString()}>
                      {res.id} - {res.name}
                    </MenuItem>
                  ))
                )}
                {initialResourceId && !resources.find(r => r.id.toString() === initialResourceId) && (
                  <MenuItem value={initialResourceId}>{initialResourceId}</MenuItem>
                )}
              </Select>
              {initialResourceId && <Typography variant="caption" color="text.secondary" sx={{ml: 1, mt: 0.5}}>Selected from Resource Hub</Typography>}
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Booking Date" name="bookingDate" type="date"
              InputLabelProps={{ shrink: true }} value={formData.bookingDate}
              onChange={handleChange} required
              inputProps={{ min: today }}
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><EventNote sx={{ color: '#4f46e5' }} /></InputAdornment>,
                sx: { borderRadius: '12px' },
                onClick: (e) => e.currentTarget.querySelector('input')?.showPicker?.()
              }}
            />
          </Grid>

          {/* Row 2: Start and End Time - Now standard dropdowns */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Start Time</InputLabel>
              <Select
                name="startTime"
                value={formData.startTime}
                label="Start Time"
                onChange={handleChange}
                startAdornment={<InputAdornment position="start" sx={{mr: 1}}><AccessTime sx={{ color: '#4f46e5' }} /></InputAdornment>}
                endAdornment={<InputAdornment position="end" sx={{mr: 3}}><AccessTime sx={{ color: '#64748b' }} /></InputAdornment>}
                sx={{ borderRadius: '12px' }}
              >
                {timeSlots.map(slot => (
                  <MenuItem key={slot.value} value={slot.value}>{slot.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>End Time</InputLabel>
              <Select
                name="endTime"
                value={formData.endTime}
                label="End Time"
                onChange={handleChange}
                startAdornment={<InputAdornment position="start" sx={{mr: 1}}><AccessTime sx={{ color: '#4f46e5' }} /></InputAdornment>}
                endAdornment={<InputAdornment position="end" sx={{mr: 3}}><AccessTime sx={{ color: '#64748b' }} /></InputAdornment>}
                sx={{ borderRadius: '12px' }}
              >
                {timeSlots.map(slot => (
                  <MenuItem key={slot.value} value={slot.value}>{slot.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Row 3: Purpose and Attendees */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Purpose" name="purpose" 
              value={formData.purpose} onChange={handleChange} required
              placeholder="e.g. Study session"
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><Description sx={{ color: '#4f46e5' }} /></InputAdornment>,
                sx: { borderRadius: '12px' }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Expected Attendees" name="expectedAttendees"
              type="number" value={formData.expectedAttendees} onChange={handleChange}
              required inputProps={{ min: 1 }}
              InputProps={{ 
                startAdornment: <InputAdornment position="start"><People sx={{ color: '#4f46e5' }} /></InputAdornment>,
                sx: { borderRadius: '12px' }
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large" fullWidth
              disabled={loading}
              sx={{
                py: 2, mt: 2, fontSize: '1.1rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
                borderRadius: '15px',
                textTransform: 'none',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 15px 30px rgba(79, 70, 229, 0.4)',
                },
                transition: 'all 0.3s'
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : '🖋️ Submit Booking Request'}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default BookingForm;
