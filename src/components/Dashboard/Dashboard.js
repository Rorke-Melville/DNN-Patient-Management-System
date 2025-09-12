import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Fab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add,
  Search,
  CalendarToday,
  People,
  Assignment,
} from '@mui/icons-material';
import AppointmentsList from '../Appointments/AppointmentsList';

const Dashboard = ({ 
  appointments, 
  onBookAppointment, 
  onSearchPatients, 
  onCompleteAppointment,
  completedToday // Added from App.js
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate stats (use prop for completedToday)
  const todayAppointments = appointments.filter(app => {
    const today = new Date().toDateString();
    return new Date(app.appointment_date).toDateString() === today;
  }).length;

  const pendingAppointments = appointments.filter(app => 
    app.status === 'Scheduled'
  ).length;

  const statsCards = [
    {
      title: "Today's Appointments",
      value: todayAppointments,
      icon: <CalendarToday />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Pending Appointments',
      value: pendingAppointments,
      icon: <Assignment />,
      color: theme.palette.warning.main,
    },
    {
      title: 'Completed Today',
      value: completedToday, // Use prop instead of filter
      icon: <People />,
      color: theme.palette.success.main,
    },
  ];

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          Dashboard
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Welcome back! Here's what's happening with your patients today.
        </Typography>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onBookAppointment}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Book Appointment
          </Button>
          <Button
            variant="outlined"
            startIcon={<Search />}
            onClick={onSearchPatients}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Search Patients
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                border: `1px solid ${stat.color}20`,
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h6" color="text.secondary">
                    {stat.title}
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="p"
                  sx={{
                    fontWeight: 700,
                    color: stat.color,
                    ml: 6,
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Appointments List */}
      <Card>
        <CardContent>
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{ mb: 3, fontWeight: 600 }}
          >
            Upcoming Appointments
          </Typography>
          <AppointmentsList
            appointments={appointments}
            onComplete={onCompleteAppointment}
          />
        </CardContent>
      </Card>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="book appointment"
          onClick={onBookAppointment}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default Dashboard;