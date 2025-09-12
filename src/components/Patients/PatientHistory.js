import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Grid,
} from '@mui/material';
import {
  Person,
  Close,
  History,
  EventNote,
  AccessTime,
  LocalHospital,
  Assignment,
  Monitor,
  CheckCircle,
  Schedule,
  Cancel,
} from '@mui/icons-material';

const PatientHistory = ({ open, onClose, patient, history }) => {
  if (!patient || !history) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Not provided';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle />;
      case 'scheduled':
        return <Schedule />;
      case 'cancelled':
        return <Cancel />;
      default:
        return <EventNote />;
    }
  };

  const formatVitals = (vitals) => {
    if (!vitals || typeof vitals !== 'object') return 'No vitals recorded';
    
    const vitalEntries = Object.entries(vitals);
    if (vitalEntries.length === 0) return 'No vitals recorded';
    
    return vitalEntries.map(([key, value]) => `${key.toUpperCase()}: ${value}`).join(', ');
  };

  const sortedHistory = [...history].sort((a, b) => {
    const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
    const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
    return dateB - dateA; // Most recent first
  });

  const completedVisits = history.filter(visit => visit.status?.toLowerCase() === 'completed').length;
  const upcomingVisits = history.filter(visit => visit.status?.toLowerCase() === 'scheduled').length;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'secondary.main',
              width: 56,
              height: 56,
            }}
          >
            <History sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Patient History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Complete visit history and records
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Patient Header Card */}
        <Card 
          elevation={0}
          sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 64,
                  height: 64,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Person sx={{ fontSize: 36 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {patient.first_name} {patient.last_name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${history.length} Total Visits`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label={`${completedVisits} Completed`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 500,
                    }}
                  />
                  {upcomingVisits > 0 && (
                    <Chip
                      label={`${upcomingVisits} Upcoming`}
                      size="small"
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Visit History */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
          Visit History
        </Typography>

        {sortedHistory.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', border: '1px solid', borderColor: 'grey.200' }}>
            <History sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No visits recorded
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This patient hasn't had any appointments yet.
            </Typography>
          </Paper>
        ) : (
          <List sx={{ p: 0 }}>
            {sortedHistory.map((visit, index) => (
              <Box key={visit.id}>
                <Card 
                  elevation={0} 
                  sx={{ 
                    mb: 2, 
                    border: '1px solid', 
                    borderColor: 'grey.200',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3}>
                      {/* Visit Info */}
                      <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <EventNote color="primary" />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Visit #{index + 1}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Date & Time
                          </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 500, mb: 2 }}>
                          {formatDate(visit.appointment_date)} at {formatTime(visit.appointment_time)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(visit.status)}
                          <Chip
                            label={visit.status || 'Unknown'}
                            color={getStatusColor(visit.status)}
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      </Grid>

                      {/* Records */}
                      <Grid item xs={12} md={8}>
                        {visit.patient_records && visit.patient_records.length > 0 ? (
                          visit.patient_records.map((record, recordIndex) => (
                            <Box key={recordIndex}>
                              {/* Notes */}
                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Assignment sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Visit Notes
                                  </Typography>
                                </Box>
                                <Paper 
                                  elevation={0} 
                                  sx={{ 
                                    p: 2, 
                                    bgcolor: 'grey.50', 
                                    border: '1px solid', 
                                    borderColor: 'grey.200' 
                                  }}
                                >
                                  <Typography variant="body2">
                                    {record.notes || 'No notes recorded'}
                                  </Typography>
                                </Paper>
                              </Box>

                              {/* Vitals */}
                              <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Monitor sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                    Vitals
                                  </Typography>
                                </Box>
                                <Paper 
                                  elevation={0} 
                                  sx={{ 
                                    p: 2, 
                                    bgcolor: 'grey.50', 
                                    border: '1px solid', 
                                    borderColor: 'grey.200' 
                                  }}
                                >
                                  <Typography variant="body2">
                                    {formatVitals(record.vitals)}
                                  </Typography>
                                </Paper>
                              </Box>

                              {/* Recorded timestamp */}
                              {record.recorded_at && (
                                <Typography variant="caption" color="text.secondary">
                                  Recorded: {new Date(record.recorded_at).toLocaleString()}
                                </Typography>
                              )}
                            </Box>
                          ))
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 3 }}>
                            <LocalHospital sx={{ fontSize: 32, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {visit.status?.toLowerCase() === 'completed' 
                                ? 'No records available for this visit' 
                                : 'Visit not completed yet'
                              }
                            </Typography>
                          </Box>
                        )}
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button 
          onClick={onClose} 
          startIcon={<Close />}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientHistory;