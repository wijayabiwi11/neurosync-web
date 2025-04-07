import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function DeviceList() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // TODO: Implement device fetching logic
    const fetchDevices = async () => {
      try {
        // Temporary mock data
        const mockDevices = [
          { id: 1, name: 'Device 1', status: 'Online', lastSync: '2024-04-07' },
          { id: 2, name: 'Device 2', status: 'Offline', lastSync: '2024-04-06' },
        ];
        setDevices(mockDevices);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch devices');
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

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
    <Container>
      <Box sx={{ my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Your Devices
          </Typography>
          <Button
            component={Link}
            to="/devices/add"
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Device
          </Button>
        </Box>

        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {device.name}
                  </Typography>
                  <Typography color="textSecondary" gutterBottom>
                    Status: {device.status}
                  </Typography>
                  <Typography color="textSecondary">
                    Last Sync: {device.lastSync}
                  </Typography>
                  <Box mt={2}>
                    <Button
                      component={Link}
                      to={`/devices/${device.id}`}
                      variant="outlined"
                      fullWidth
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {devices.length === 0 && (
          <Box textAlign="center" mt={4}>
            <Typography variant="body1" color="textSecondary">
              No devices found. Add your first device to get started.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default DeviceList; 