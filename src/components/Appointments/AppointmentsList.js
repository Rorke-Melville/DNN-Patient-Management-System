import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Chip,
  Box,
  Typography,
  Avatar,
  Divider,
  useTheme,
} from '@mui/material';
import {
  Person,
  CheckCircle,
  Schedule,
  Today,
} from '@mui/icons-material';

const AppointmentsList = ({ appointments, onComplete }) => {
  const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'warning';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled':
        return <Schedule fontSize="small" />;
      case 'Completed':
        return <CheckCircle fontSize="small" />;
      default:
        return <Schedule fontSize="small" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          color: 'text.secondary',
        }}
      >
        <Today sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
        <Typography variant="h6" gutterBottom>
          No appointments scheduled
        </Typography>
        <Typography variant="body2">
          Book your first appointment to get started
        </Typography>
      </Box>
    );
  }

  return (
    <List sx={{ width: '100%' }}>
      {appointments.map((appointment, index) => (
        <React.Fragment key={appointment.id}>
          <ListItem
            alignItems="flex-start"
            sx={{
              py: 2,
              px: { xs: 1, sm: 2 },
              '&:hover': {
                backgroundColor: 'action.hover',
                borderRadius: 1,
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                mr: 2,
                width: 48,
                height: 48,
              }}
            >
              <Person />
            </Avatar>
            
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                    }}
                  >
                    {appointment.patients.first_name} {appointment.patients.last_name}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(appointment.status)}
                    label={appointment.status}
                    color={getStatusColor(appointment.status)}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                  >
                    {formatDate(appointment.appointment_date)} at{' '}
                    <Box
                      component="span"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {appointment.appointment_time}
                    </Box>
                  </Typography>
                </Box>
              }
            />
            
            <ListItemSecondaryAction>
              {appointment.status === 'Scheduled' && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircle />}
                  onClick={() => onComplete(appointment.id)}
                  sx={{
                    minWidth: 100,
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Complete
                </Button>
              )}
              {appointment.status === 'Completed' && (
                <Chip
                  label="Done"
                  color="success"
                  size="small"
                  icon={<CheckCircle />}
                />
              )}
            </ListItemSecondaryAction>
          </ListItem>
          
          {index < appointments.length - 1 && (
            <Divider variant="inset" component="li" />
          )}
        </React.Fragment>
      ))}
    </List>
  );
};

export default AppointmentsList;