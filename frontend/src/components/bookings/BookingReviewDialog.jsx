import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Typography, Box, Divider 
} from '@mui/material';
import { approveBooking, rejectBooking } from '../../services/bookingAdminService';
import { toast } from 'react-toastify';

const BookingReviewDialog = ({ booking, onClose, onSuccess }) => {
    const [remarks, setRemarks] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReview = async (isApproved) => {
        if (!isApproved && !remarks.trim()) {
            toast.error("Please provide a reason for rejection");
            return;
        }

        setLoading(true);
        try {
            if (isApproved) {
                await approveBooking(booking.id, remarks);
            } else {
                await rejectBooking(booking.id, remarks);
            }
            toast.success(`Booking ${isApproved ? 'Approved' : 'Rejected'} successfully`);
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "Review failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Review Booking Request
            </DialogTitle>
            <DialogContent dividers>
                <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">Requested By:</Typography>
                    <Typography variant="body1" fontWeight="500">{booking.userEmail}</Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="subtitle2" color="textSecondary">Resource ID & Purpose:</Typography>
                    <Typography variant="body1">#{booking.resourceId} - {booking.purpose}</Typography>
                </Box>
                <Box mb={3}>
                    <Typography variant="subtitle2" color="textSecondary">Schedule:</Typography>
                    <Typography variant="body1">{booking.bookingDate} | {booking.startTime.slice(0,5)} - {booking.endTime.slice(0,5)}</Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <TextField
                    fullWidth
                    label="Admin Remarks / Rejection Reason"
                    multiline
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter approval feedback or why the request was rejected..."
                    variant="outlined"
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={onClose} color="inherit" disabled={loading}>
                    Cancel
                </Button>
                <Button 
                    onClick={() => handleReview(false)} 
                    variant="outlined" 
                    color="error" 
                    disabled={loading}
                >
                    Reject
                </Button>
                <Button 
                    onClick={() => handleReview(true)} 
                    variant="contained" 
                    color="success" 
                    disabled={loading}
                >
                    Approve
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BookingReviewDialog;
