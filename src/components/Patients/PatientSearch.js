import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Box,
  Typography,
  InputAdornment,
  Avatar,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Search,
  Person,
  Visibility,
  History,
  Close,
  Phone,
  LocationOn,
} from '@mui/icons-material';

const PatientSearch = ({ 
  open, 
  onClose, 
  patients, 
  onSearch,
  onViewProfile,
  onViewHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState(''); // Local state for search

  const handleClose = () => {
    setSearchTerm(''); // Clear local search
    onClose();
  };

  const handleSearchChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term); // Update local state
    onSearch(term); // Trigger search
  };

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

  const formatPhone = (phone) => {
    if (!phone) return 'No phone';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Search color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            Search Patients
          </Typography>
        </Box>
        
        <TextField
          fullWidth
          placeholder="Search by first name or last name..."
          value={searchTerm} // Use local state
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {!patients || patients.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              textAlign: 'center',
              py: 6,
              backgroundColor: 'grey.50',
              borderRadius: 2,
            }}
          >
            <Person sx={{ fontSize: 64, mb: 2, color: 'text.disabled' }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchTerm ? 'No patients found' : 'Start typing to search'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Enter a patient\'s first or last name'
              }
            </Typography>
          </Paper>
        ) : (
          <List sx={{ width: '100%' }}>
            {patients.map((patient, index) => (
              <React.Fragment key={patient.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      borderRadius: 1,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: 'secondary.main',
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
                          {patient.first_name} {patient.last_name}
                        </Typography>
                        {patient.date_of_birth && (
                          <Chip
                            label={`Age ${calculateAge(patient.date_of_birth)}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <Phone sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {formatPhone(patient.phone_number)}
                          </Typography>
                        </Box>
                        {patient.address && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 300,
                              }}
                            >
                              {patient.address}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => onViewProfile(patient)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Profile
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<History />}
                        onClick={() => onViewHistory(patient)}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        History
                      </Button>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < patients.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          onClick={handleClose} 
          startIcon={<Close />}
        >
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default PatientSearch;