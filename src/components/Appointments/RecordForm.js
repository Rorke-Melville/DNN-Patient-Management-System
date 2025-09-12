import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { Notes, MonitorHeart } from '@mui/icons-material';

const RecordForm = ({ open, onClose, onSubmit, appointmentDetails }) => {
  const [notes, setNotes] = useState('');
  const [vitals, setVitals] = useState('');

  // Reset form when dialog opens for a new appointment
  useEffect(() => {
    if (open) {
      setNotes('');
      setVitals('');
    }
  }, [open]);

  const handleSave = async () => {
    const result = await onSubmit({ notes, vitals });
    if (result.success) {
      // The parent component (App.js) will handle closing the dialog
      // This allows for a more controlled flow
    } else {
      alert(result.error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" component="div">
          Complete Appointment
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {appointmentDetails?.patientName} on {appointmentDetails?.appointmentDate}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Box mb={3}>
          <Typography
            variant="body1"
            component="label"
            htmlFor="notes-input"
            sx={{ display: 'block', mb: 1, fontWeight: 'medium' }}
          >
            <Notes sx={{ verticalAlign: 'middle', mr: 1 }} />
            Notes
          </Typography>
          <TextField
            id="notes-input"
            label="Enter visit notes..."
            multiline
            rows={4}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
          />
        </Box>
        <Box mb={2}>
          <Typography
            variant="body1"
            component="label"
            htmlFor="vitals-input"
            sx={{ display: 'block', mb: 1, fontWeight: 'medium' }}
          >
            <MonitorHeart sx={{ verticalAlign: 'middle', mr: 1 }} />
            Vitals
          </Typography>
          <TextField
            id="vitals-input"
            label='e.g., {"bp": "120/80", "temp": 98.6}'
            fullWidth
            value={vitals}
            onChange={(e) => setVitals(e.target.value)}
            variant="outlined"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save Record
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordForm;