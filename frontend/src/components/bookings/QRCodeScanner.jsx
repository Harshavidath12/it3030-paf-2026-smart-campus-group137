import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Box, Typography, Button, Paper, Alert, CircularProgress, Divider } from '@mui/material';
import { QrCodeScanner as QrIcon, CheckCircle, SensorsOff, FileUpload, CameraAlt, Refresh } from '@mui/icons-material';
import { checkInWithQRCode } from '../../services/bookingService';
import { toast } from 'react-toastify';

const QRCodeScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const html5QrCodeRef = useRef(null);
    const fileInputRef = useRef(null);
    const scannerId = "qr-reader-container";

    // Initialize the library instance once on mount
    useEffect(() => {
        html5QrCodeRef.current = new Html5Qrcode(scannerId);

        return () => {
            // Cleanup: stop camera if active on unmount
            if (html5QrCodeRef.current?.isScanning) {
                html5QrCodeRef.current.stop().catch(e => console.error("Unmount cleanup failed", e));
            }
        };
    }, []);

    const startCamera = async () => {
        if (!html5QrCodeRef.current) return;
        
        setError(null);
        setSuccess(null);

        try {
            await html5QrCodeRef.current.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                },
                (decodedText) => {
                    setScanResult(decodedText);
                    stopCamera();
                    toast.success("QR Code detected!");
                },
                (errorMessage) => { /* ignore constant updates */ }
            );
            setCameraActive(true);
        } catch (err) {
            console.error("Camera start error", err);
            setError("Unable to start camera. Please ensure permissions are granted.");
            setCameraActive(false);
        }
    };

    const stopCamera = async () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            try {
                await html5QrCodeRef.current.stop();
                setCameraActive(false);
            } catch (err) {
                console.error("Camera stop error", err);
            }
        }
    };

    const handleFileScan = async (e) => {
        const file = e.target.files[0];
        if (!file || !html5QrCodeRef.current) return;

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // If camera is active, stop it first
            if (cameraActive) await stopCamera();

            const result = await html5QrCodeRef.current.scanFile(file, true);
            setScanResult(result);
            toast.success("QR code extracted from image!");
        } catch (err) {
            setError("Could not find a valid QR code in this image.");
            toast.error("Invalid QR image");
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleConfirmCheckIn = async () => {
        if (!scanResult) return;
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await checkInWithQRCode(scanResult);
            setSuccess('Welcome! Check-in successful.');
            toast.success('Check-in confirmed! ✅');
            setScanResult(null);
        } catch (err) {
            const msg = err.response?.data?.message || 'Check-in failed. Session may be expired.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Paper elevation={0} sx={{
            p: 4, maxWidth: 500, mx: 'auto', mt: 1, textAlign: 'center',
            borderRadius: 8, background: '#fff',
            border: '1px solid #f1f5f9',
            boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.12)'
        }}>
            <Box sx={{ mb: 3 }}>
                <QrIcon sx={{ fontSize: 52, color: '#4f46e5', mb: 1 }} />
                <Typography variant="h5" fontWeight="900" color="#0f172a">
                    Check-in 
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Use your camera or upload a QR image
                </Typography>
            </Box>

            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

            {/* Permanent Container for Scanner - Fixing removeChild Error */}
            <Box sx={{ 
                display: scanResult ? 'none' : 'block',
                mb: 3
            }}>
                <Box id={scannerId} sx={{ 
                    width: '100%', 
                    minHeight: cameraActive ? 300 : 180,
                    mx: 'auto', 
                    borderRadius: 5,
                    bgcolor: '#f8fafc',
                    border: '2px dashed #e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                }}>
                    {!cameraActive && (
                        <Box sx={{ opacity: 0.4, textAlign: 'center' }}>
                            <SensorsOff sx={{ fontSize: 44, mb: 1 }} />
                            <Typography variant="caption" display="block">Scanner Ready</Typography>
                        </Box>
                    )}
                </Box>

                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {!cameraActive ? (
                            <Button 
                                fullWidth 
                                variant="contained" 
                                startIcon={<CameraAlt />} 
                                onClick={startCamera}
                                sx={{ borderRadius: 4, py: 1.8, bgcolor: '#4f46e5', '&:hover': { bgcolor: '#4338ca' } }}
                            >
                                Open Camera
                            </Button>
                        ) : (
                            <Button 
                                fullWidth 
                                variant="outlined" 
                                color="error" 
                                onClick={stopCamera}
                                sx={{ borderRadius: 4, py: 1.8 }}
                            >
                                Stop Camera
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ my: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">OR</Typography>
                    </Divider>

                    <Button 
                        variant="soft" 
                        fullWidth
                        startIcon={loading ? <CircularProgress size={20}/> : <FileUpload />} 
                        onClick={() => fileInputRef.current?.click()}
                        sx={{ 
                            borderRadius: 4, py: 1.5, bgcolor: '#f1f5f9', color: '#475569',
                            textTransform: 'none', fontWeight: 600
                        }}
                        disabled={loading}
                    >
                        Scan from Files
                    </Button>
                    <input 
                        type="file" 
                        hidden 
                        ref={fileInputRef} 
                        accept="image/*" 
                        onChange={handleFileScan} 
                    />
                </Box>
            </Box>

            {/* Success/Result UI */}
            {scanResult && (
                <Box sx={{ mt: 1 }}>
                    <Box sx={{ p: 3, bgcolor: '#f0fdf4', borderRadius: 5, border: '1px solid #dcfce7', mb: 3 }}>
                        <Typography variant="subtitle1" color="#166534" fontWeight="900" gutterBottom>
                            ✅ Code Verified
                        </Typography>
                        <Typography variant="caption" sx={{ wordBreak: 'break-all', color: '#15803d', opacity: 0.8 }}>
                            {scanResult.substring(0, 50)}...
                        </Typography>
                    </Box>

                    <Button variant="contained" size="large" fullWidth
                        onClick={handleConfirmCheckIn} disabled={loading}
                        sx={{
                            mb: 2, py: 2.2, borderRadius: 4, fontWeight: '900', fontSize: '1.1rem',
                            background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)',
                            boxShadow: '0 12px 24px rgba(79, 70, 229, 0.4)'
                        }}
                    >
                        {loading ? <CircularProgress size={26} color="inherit" /> : 'Confirm Check-in'}
                    </Button>

                    <Button variant="text" color="primary" fullWidth onClick={() => setScanResult(null)} startIcon={<Refresh />}>
                        Scan Another QR
                    </Button>
                </Box>
            )}
        </Paper>
    );
};

export default QRCodeScanner;
