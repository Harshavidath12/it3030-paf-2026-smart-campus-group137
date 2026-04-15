import React from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import AdminBookingTable from '../components/bookings/AdminBookingTable';
import { useNavigate } from 'react-router-dom';

const AdminBookingsPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box mb={4}>
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
                    <Link underline="hover" color="inherit" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                        Smart Campus
                    </Link>
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
