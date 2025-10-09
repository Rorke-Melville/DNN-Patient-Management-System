import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Box, // Added Box to imports
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PersonAdd, CalendarToday } from '@mui/icons-material';

const PatientAdd = ({ open, onClose, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = () => {
    if (!firstName || !lastName || !dateOfBirth) {
      alert('Please enter first name, last name, and date of birth.');
      return;
    }
    onSubmit({
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : null,
      address: address || null,
      phone_number: phoneNumber || null,
    });
    setFirstName('');
    setLastName('');
    setDateOfBirth(null);
    setAddress('');
    setPhoneNumber('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <PersonAdd color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Add New Patient
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Enter patient details below
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 5, pt: 2 }}>
        <Grid container spacing={2} sx={{ pl: 0, ml: 0 }}>
          <Grid item xs={6}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              required
              sx={{ ml: 0, '& .MuiOutlinedInput-root': { ml: 0 } }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              required
              sx={{ ml: 0, '& .MuiOutlinedInput-root': { ml: 0 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={dateOfBirth}
                onChange={(newDate) => setDateOfBirth(newDate)}
                maxDate={new Date()}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
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
                        ml: 0,
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              sx={{ ml: 0, '& .MuiOutlinedInput-root': { ml: 0 } }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              sx={{ ml: 0, '& .MuiOutlinedInput-root': { ml: 0 } }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          Add Patient
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientAdd;