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
      <Typography variant="h5" gutterBottom sx={{ color: '#1e1b4b', fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <span style={{ fontSize: '1.4rem' }}>📋</span> Request a New Booking
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required disabled={!!initialResourceId}>
              <InputLabel>Resource ID</InputLabel>
              <Select
                name="resourceId"
                value={formData.resourceId}
                label="Resource ID"
                onChange={handleChange}
                startAdornment={<InputAdornment position="start" sx={{mr: 1}}><MeetingRoom sx={{ color: '#4f46e5' }} /></InputAdornment>}
              >
                {fetchingResources ? (
                  <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                ) : resources.length === 0 && !initialResourceId ? (
                  <MenuItem disabled>No active resources found</MenuItem>
                ) : (
                  resources.map(res => (
                    <MenuItem key={res.id} value={res.id.toString()}>
                      {res.id}
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
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Booking Date" name="bookingDate" type="date"
              InputLabelProps={{ shrink: true }} value={formData.bookingDate}
              onChange={handleChange} required
              inputProps={{ min: today }}
              InputProps={{ startAdornment: <InputAdornment position="start"><EventNote sx={{ color: '#4f46e5' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Start Time" name="startTime" type="time"
              InputLabelProps={{ shrink: true }} value={formData.startTime}
              onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><AccessTime sx={{ color: '#4f46e5' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="End Time" name="endTime" type="time"
              InputLabelProps={{ shrink: true }} value={formData.endTime}
              onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><AccessTime sx={{ color: '#4f46e5' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <TextField fullWidth label="Purpose" name="purpose" multiline rows={1}
              value={formData.purpose} onChange={handleChange} required
              InputProps={{ startAdornment: <InputAdornment position="start"><Description sx={{ color: '#4f46e5' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Expected Attendees" name="expectedAttendees"
              type="number" value={formData.expectedAttendees} onChange={handleChange}
              required inputProps={{ min: 1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><People sx={{ color: '#4f46e5' }} /></InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large" fullWidth
              disabled={loading}
              sx={{
                py: 1.8, mt: 1, fontSize: '1rem', fontWeight: 800,
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
                borderRadius: '15px'
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
