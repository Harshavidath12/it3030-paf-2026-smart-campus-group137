import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, 
    FormControl, InputLabel, Select, MenuItem, Tooltip,
    Button, CircularProgress, Container
} from '@mui/material';
import { 
    Delete, RateReview, FilterList, Refresh,
    CheckCircle, HourglassEmpty, Block, Cancel, QrCode
} from '@mui/icons-material';
import { fetchAdminBookings, deleteBooking } from '../../services/bookingAdminService';
import BookingReviewDialog from './BookingReviewDialog';
import { toast } from 'react-toastify';

const statusConfig = {
    APPROVED: { color: 'success', icon: <CheckCircle fontSize="small" /> },
    PENDING: { color: 'warning', icon: <HourglassEmpty fontSize="small" /> },
    REJECTED: { color: 'error', icon: <Block fontSize="small" /> },
    CANCELLED: { color: 'default', icon: <Cancel fontSize="small" /> },
    CHECKED_IN: { color: 'primary', icon: <QrCode fontSize="small" /> },
};

const AdminBookingTable = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchAdminBookings(filter);
            setBookings(data);
        } catch (err) {
            toast.error("Failed to load campus bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filter]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this booking record?")) return;
        try {
            await deleteBooking(id);
            toast.info("Booking record deleted");
            loadData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    if (loading && bookings.length === 0) return (
        <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
    );

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                    Campus Resource Utilization
                </Typography>
                
                <Box display="flex" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Status Filter</InputLabel>
                        <Select
                            value={filter}
                            label="Status Filter"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="PENDING">Pending Approval</MenuItem>
                            <MenuItem value="APPROVED">Approved Only</MenuItem>
                            <MenuItem value="CHECKED_IN">Checked In</MenuItem>
                            <MenuItem value="REJECTED">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                    <Button startIcon={<Refresh />} variant="outlined" onClick={loadData}>
                        Reload
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ 
                borderRadius: 4, 
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Resource</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>User Email</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>DateTime</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Purpose</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                    <Typography color="textSecondary">No bookings found for the selected criteria.</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((b) => (
                                <TableRow key={b.id} hover>
                                    <TableCell>#{b.resourceId}</TableCell>
                                    <TableCell>{b.userEmail}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{b.bookingDate}</Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            {b.startTime.slice(0,5)} - {b.endTime.slice(0,5)}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title={b.purpose}>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                                {b.purpose}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={b.status} 
                                            size="small" 
                                            color={statusConfig[b.status]?.color || 'default'}
                                            icon={statusConfig[b.status]?.icon}
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end">
                                            {b.status === 'PENDING' && (
                                                <Tooltip title="Review Booking">
                                                    <IconButton color="primary" onClick={() => setSelectedReview(b)}>
                                                        <RateReview />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Delete Permanently">
                                                <IconButton color="error" onClick={() => handleDelete(b.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {selectedReview && (
                <BookingReviewDialog 
                    booking={selectedReview} 
                    onClose={() => setSelectedReview(null)} 
                    onSuccess={loadData}
                />
            )}
        </Box>
    );
};

export default AdminBookingTable;
