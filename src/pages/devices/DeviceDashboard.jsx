import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
} from '@mui/material';

function DeviceDashboard({ children }) {
  const { imei } = useParams();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        // TODO: Implement device details fetching
        // Mock data for now
        const mockDevice = {
          id: imei,
          name: 'Test Device',
          status: 'Online',
          lastSync: '2024-04-07',
          batteryLevel: 85,
          signalStrength: 'Good',
        };
        setDevice(mockDevice);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch device details');
        setLoading(false);
      }
    };

    fetchDeviceDetails();
  }, [imei]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Box>
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {device?.name}
          </Typography>

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Device Status
                </Typography>
                <Typography>Status: {device?.status}</Typography>
                <Typography>Last Sync: {device?.lastSync}</Typography>
                <Typography>Battery: {device?.batteryLevel}%</Typography>
                <Typography>Signal: {device?.signalStrength}</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {children}
    </Box>
  );
}

export default DeviceDashboard; 