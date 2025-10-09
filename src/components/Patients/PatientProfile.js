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
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import {
  Person,
  Close,
  Cake,
  Phone,
  LocationOn,
  Email,
  Badge,
} from '@mui/icons-material';

const PatientProfile = ({ open, onClose, patient }) => {
  if (!patient) return null;

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPhone = (phone) => {
    if (!phone) return 'Not provided';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        {
          icon: <Badge />,
          label: 'Full Name',
          value: `${patient.first_name} ${patient.last_name}`
        },
        {
          icon: <Cake />,
          label: 'Date of Birth',
          value: formatDate(patient.date_of_birth),
          extra: patient.date_of_birth && `Age: ${calculateAge(patient.date_of_birth)} years`
        }
      ]
    },
    {
      title: 'Contact Information',
      items: [
        {
          icon: <Phone />,
          label: 'Phone Number',
          value: formatPhone(patient.phone_number)
        },
        {
          icon: <LocationOn />,
          label: 'Address',
          value: patient.address || 'Not provided'
        }
      ]
    },
    {
      title: 'Past Appointment',
      items: [
        {
          icon: <Cake />,
          label: 'Last Appointment',
          value: patient.last_appointment ? formatDate(patient.last_appointment) : 'Not available',
        }
      ]
    }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        }
      }}
    >
      <DialogContent sx={{ pt: 1 }}>
        {/* Patient Header Card */}
        <Card 
          elevation={0}
          sx={{ 
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            maxWidth: '70%',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
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
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {patient.first_name} {patient.last_name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
                  {patient.date_of_birth && (
                    <Chip
                      label={`${calculateAge(patient.date_of_birth)} years old`}
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

        {/* Profile Sections */}
        <Grid container spacing={2} sx={{ justifyContent: 'center', mt: 4 }}>
          {profileSections.map((section, sectionIndex) => (
            <Grid item xs={12} md={4} key={sectionIndex} sx={{ minWidth: 0 }}>
              <Card elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', minWidth: '100%', minHeight: 300 }}>
                <CardContent>
                  <Typography 
                    variant="h6" 
                    sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}
                  >
                    {section.title}
                  </Typography>
                  
                  {section.items.map((item, itemIndex) => (
                    <Box key={itemIndex}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
                        <Box
                          sx={{
                            color: 'text.secondary',
                            mt: 0.25,
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontWeight: 500, mb: 0.25 }}
                          >
                            {item.label}
                          </Typography>
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              fontWeight: 500,
                              color: item.value === 'Not provided' || item.value === 'Not available' ? 'text.secondary' : 'text.primary'
                            }}
                          >
                            {item.value}
                          </Typography>
                          {item.extra && (
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ mt: 0.25 }}
                            >
                              {item.extra}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      {itemIndex < section.items.length - 1 && (
                        <Divider sx={{ my: 1.5 }} />
                      )}
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Information */}
        {patient.emergency_contact && (
          <Card elevation={0} sx={{ mt: 3, border: '1px solid', borderColor: 'grey.200' }}>
            <CardContent>
              <Typography 
                variant="h6" 
                sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}
              >
                Emergency Contact
              </Typography>
              <Typography variant="body1">
                {patient.emergency_contact}
              </Typography>
            </CardContent>
          </Card>
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

export default PatientProfile;