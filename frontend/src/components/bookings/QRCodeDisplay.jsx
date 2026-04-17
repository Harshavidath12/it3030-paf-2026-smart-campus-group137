import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { QrCode2, Download } from '@mui/icons-material';

const QRCodeDisplay = ({ base64QR, bookingId }) => {
  if (!base64QR) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = base64QR;
    link.download = `booking-qr-${bookingId || 'id'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{
      mt: 2, textAlign: 'center', p: 3,
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      borderRadius: 4, border: '2px dashed #6366f1',
      boxShadow: '0 8px 30px rgba(99, 102, 241, 0.08)'
    }}>
      <QrCode2 sx={{ fontSize: 32, color: '#4f46e5', mb: 1 }} />
      <Typography variant="subtitle1" color="primary" gutterBottom fontWeight="bold">
        Your Check-in QR Code
      </Typography>
      
      <Box sx={{ p: 1.5, bgcolor: '#fff', display: 'inline-block', borderRadius: 3, mb: 2, mt: 1 }}>
        <img src={base64QR} alt="QR Code for Check-in"
          style={{ maxWidth: '180px', height: 'auto', borderRadius: 4, display: 'block' }} />
      </Box>

      <Typography variant="caption" display="block" color="text.secondary" sx={{ mb: 2 }}>
        📱 Scan this on the day of your booking to check in
      </Typography>

      <Button 
        variant="contained" 
        size="small" 
        startIcon={<Download />}
        onClick={handleDownload}
        sx={{ 
          borderRadius: 2, 
          bgcolor: '#4f46e5', 
          textTransform: 'none',
          '&:hover': { bgcolor: '#4338ca' }
        }}
      >
        Download QR Image
      </Button>
    </Box>
  );
};

export default QRCodeDisplay;
