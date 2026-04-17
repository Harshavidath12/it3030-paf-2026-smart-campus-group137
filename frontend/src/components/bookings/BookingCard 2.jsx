import React from 'react';
import { Card, CardContent, Typography, Chip, Box, Button, Divider } from '@mui/material';
import {
  CheckCircle, HourglassEmpty, Cancel, Block, QrCode2,
  CalendarMonth, AccessTime, People
} from '@mui/icons-material';
import QRCodeDisplay from './QRCodeDisplay';

const statusConfig = {
  APPROVED: { color: 'success', icon: <CheckCircle fontSize="small" />, label: 'Approved' },
  PENDING: { color: 'warning', icon: <HourglassEmpty fontSize="small" />, label: 'Pending' },
  REJECTED: { color: 'error', icon: <Block fontSize="small" />, label: 'Rejected' },
  CANCELLED: { color: 'default', icon: <Cancel fontSize="small" />, label: 'Cancelled' },
  CHECKED_IN: { color: 'primary', icon: <QrCode2 fontSize="small" />, label: 'Checked In' },
};

const BookingCard = ({ booking, onCancel }) => {
  const canCancel = booking.status === 'PENDING' || booking.status === 'APPROVED';
  const config = statusConfig[booking.status] || statusConfig.PENDING;

  return (
    <Card sx={{ mb: 2, overflow: 'visible' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#1e1b4b' }}>
            🏢 Resource #{booking.resourceId}
          </Typography>
          <Chip icon={config.icon} label={config.label} color={config.color} size="small" />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Details */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarMonth fontSize="small" color="primary" />
            {booking.bookingDate}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime fontSize="small" color="primary" />
            {booking.startTime?.substring(0, 5)} - {booking.endTime?.substring(0, 5)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <People fontSize="small" color="primary" />
            {booking.expectedAttendees} attendees
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mt: 1.5, mb: 1, fontStyle: 'italic', color: '#334155' }}>
          "{booking.purpose}"
        </Typography>

        {/* Rejection reason */}
        {booking.rejectionReason && (
          <Typography variant="body2" color="error" sx={{ mt: 1, p: 1.5, bgcolor: '#fef2f2', borderRadius: 2 }}>
            <strong>Rejection Reason:</strong> {booking.rejectionReason}
          </Typography>
        )}

        {booking.status === 'APPROVED' && booking.qrCodeData && (
          <QRCodeDisplay base64QR={booking.qrCodeData} bookingId={booking.id} />
        )}

        {/* Checked-in info */}
        {booking.status === 'CHECKED_IN' && booking.checkedInAt && (
          <Typography variant="body2" sx={{
            mt: 2, p: 1.5, bgcolor: '#f0fdf4', borderRadius: 2, color: '#166534', fontWeight: 600
          }}>
            ✅ Checked in at: {new Date(booking.checkedInAt).toLocaleString()}
          </Typography>
        )}

        {/* Cancel button */}
        {canCancel && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="error" size="small"
              onClick={() => onCancel(booking.id)}
              sx={{ borderRadius: 2 }}
            >
              Cancel Booking
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
