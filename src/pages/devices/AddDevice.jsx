import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Alert,
} from '@mui/material';

const steps = ['Device Information', 'Connection Setup', 'Confirmation'];

function AddDevice() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState('');
  const [deviceData, setDeviceData] = useState({
    name: '',
    serialNumber: '',
    location: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeviceData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement device registration logic
      console.log('Device data:', deviceData);
      navigate('/devices');
    } catch (err) {
      setError('Failed to add device');
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Device Name"
              name="name"
              value={deviceData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="serialNumber"
              label="Serial Number"
              name="serialNumber"
              value={deviceData.serialNumber}
              onChange={handleChange}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <TextField
              margin="normal"
              fullWidth
              id="location"
              label="Location"
              name="location"
              value={deviceData.location}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="description"
              label="Description"
              name="description"
              multiline
              rows={4}
              value={deviceData.description}
              onChange={handleChange}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Device Information
            </Typography>
            <Typography>Name: {deviceData.name}</Typography>
            <Typography>Serial Number: {deviceData.serialNumber}</Typography>
            <Typography>Location: {deviceData.location}</Typography>
            <Typography>Description: {deviceData.description}</Typography>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Device
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
          >
            {activeStep === steps.length - 1 ? 'Add Device' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddDevice; 