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
  MenuItem,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  Person,
  Schedule,
} from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const BookAppointmentForm = ({ 
  open, 
  onClose, 
  patients, 
  onSubmit,
  loading = false 
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!selectedPatient || !date || !time) {
      setError('Please fill in all fields');
      return;
    }

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(...time.split(':').map(Number));
    const now = new Date();
    if (selectedDateTime < now) {
      setError('Please select a future date and time');
      return;
    }

    setError('');
    try {
      await onSubmit({
        patientId: selectedPatient.id,
        date: date.toISOString().split('T')[0],
        time
      });
      handleClose();
    } catch (err) {
      setError('Failed to book appointment. Please try again.');
    }
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setDate(null);
    setTime('');
    setError('');
    onClose();
  };

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
  const today = new Date();

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
      <DialogTitle sx={{ pb: 1, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CalendarToday color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Book New Appointment
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
          Schedule a visit with your patient
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 5, pt: 2 }}>
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
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  '& .MuiOutlinedInput-root': { 
                    borderRadius: 2, 
                    paddingTop: '12px',
                    minHeight: '56px',
                  },
                  '& .MuiInputLabel-root': {
                    transform: 'translate(14px, 9px) scale(1)',
                    '&.Mui-focused': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                    '&.MuiInputLabel-shrink': {
                      transform: 'translate(14px, -9px) scale(0.75)',
                    },
                  },
                  '& .MuiAutocomplete-input': {
                    padding: '8px 14px',
                  },
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Appointment Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              minDate={today}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <CalendarToday sx={{ mr: 1, color: 'action.active' }} />
                    ),
                  }}
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 2,
                      '& .MuiInputBase-input': {
                        padding: '10px 14px',
                      },
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>

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