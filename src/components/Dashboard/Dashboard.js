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
  CheckCircle,
} from '@mui/icons-material';
import AppointmentsList from '../Appointments/AppointmentsList';

const Dashboard = ({ 
  appointments, 
  pastAppointments,
  onBookAppointment, 
  onSearchPatients, 
  onCompleteAppointment,
  completedToday,
  totalCompleted,
  onAddPatient,
  nurseName,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate stats
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
      color: '#2196f3', // Blue
    },
    {
      title: 'Pending Appointments',
      value: pendingAppointments,
      icon: <Assignment />,
      color: '#ff9800', // Orange
    },
    {
      title: 'Completed Today',
      value: completedToday,
      icon: <People />,
      color: '#4caf50', // Green
    },
    {
      title: 'Total Appointments',
      value: totalCompleted,
      icon: <CheckCircle />,
      color: '#e91e63', // Pink
    },
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 2 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ fontWeight: 600, color: 'text.primary' }}
        >
          Hi, {nurseName || 'Nurse'}!
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Welcome back! Here's what's happening with your patients today.
        </Typography>

        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAddPatient}
            sx={{ minWidth: { xs: '100%', sm: 'auto' } }}
          >
            Add Patient
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ mb: 4, maxWidth: '100%', mx: 'auto' }}>
        <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
          {statsCards.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                  border: `1px solid ${stat.color}20`,
                  height: '100%',
                }}
              >
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        backgroundColor: `${stat.color}20`,
                        color: stat.color,
                        mr: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(stat.icon, { sx: { fontSize: 22 } })}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    component="p"
                    sx={{
                      fontWeight: 700,
                      color: stat.color,
                      ml: 5.5,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Appointments Section */}
      <Grid container spacing={0} sx={{ width: '100%', margin: 0 }}>
        <Grid item xs={12} md={6} sx={{ padding: 0, width: '50%' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
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
                isUpcoming={true}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} sx={{ padding: 0, width: '50%' }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ mb: 3, fontWeight: 600 }}
              >
                Past Appointments
              </Typography>
              <AppointmentsList
                appointments={pastAppointments}
                onComplete={null}
                isUpcoming={false}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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