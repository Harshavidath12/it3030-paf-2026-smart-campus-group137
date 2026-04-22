import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import AdminBookingTable from '../components/bookings/AdminBookingTable';
import { useNavigate } from 'react-router-dom';

const AdminBookingsPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Box display="flex" alignItems="center" mb={1} sx={{ cursor: 'pointer', color: 'text.secondary', '&:hover': { color: 'text.primary' } }} onClick={() => navigate('/admin-dashboard')}>
                    <Typography variant="body2" sx={{ mr: 1, fontSize: '1.2rem', lineHeight: 1 }}>←</Typography>
                    <Typography variant="body2" fontWeight="500">Back</Typography>
                </Box>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Typography color="inherit">Smart Campus</Typography>
                    <Typography color="text.primary">Admin Console</Typography>
                </Breadcrumbs>
                <Typography variant="h4" fontWeight="800" sx={{ 
                    color: '#1e1b4b',
                    background: 'linear-gradient(90deg, #1e1b4b, #4f46e5)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Booking Management
                </Typography>
            </Box>

            <AdminBookingTable />
        </Container>
    );
};

export default AdminBookingsPage;
