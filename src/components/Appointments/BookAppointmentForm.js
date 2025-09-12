import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Autocomplete,
  MenuItem, // Added this import!
} from '@mui/material';
import {
  Close,
  CalendarToday,
  Person,
  Schedule,
} from '@mui/icons-material';

const BookAppointmentForm = ({ 
  open, 
  onClose, 
  patients, 
  onSubmit,
  loading = false 
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null); // Changed to object for Autocomplete
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedPatient || !date || !time) {
      setError('Please fill in all fields');
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(`${date}T${time}`);
    const now = new Date();
    if (selectedDate < now) {
      setError('Please select a future date and time');
      return;
    }

    setError('');
    try {
      await onSubmit({
        patientId: selectedPatient.id, // Use patient ID from selected object
        date,
        time
      });
      handleClose();
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    }
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setDate('');
    setTime('');
    setError('');
    onClose();
  };

  // Generate time slots (8 AM to 6 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots.push({ value: time, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarToday color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Book New Appointment
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Schedule a visit with your patient
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Autocomplete
            options={patients}
            getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
            value={selectedPatient}
            onChange={(event, newValue) => setSelectedPatient(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Patient"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <Person sx={{ mr: 1, color: 'action.active' }} />
                  ),
                }}
                fullWidth
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />

          <TextField
            fullWidth
            label="Appointment Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: today,
            }}
          />

          <TextField
            fullWidth
            select
            label="Appointment Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            InputProps={{
              startAdornment: (
                <Schedule sx={{ mr: 1, color: 'action.active' }} />
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          >
            {timeSlots.map((slot) => (
              <MenuItem key={slot.value} value={slot.value}>
                {slot.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={handleClose} 
          startIcon={<Close />}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <CalendarToday />}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookAppointmentForm;