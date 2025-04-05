import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import dayjs from 'dayjs';
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  CircularProgress,
  Grid,
  Avatar,
  InputAdornment,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Alert
} from '@mui/material';
import { 
  LocalPolice, 
  DirectionsCar, 
  Receipt, 
  LocationOn, 
  Notes, 
  Event, 
  MonetizationOn,
  Cancel,
  CheckCircle
} from '@mui/icons-material';

const ViolationEntryPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasRole } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    license_plate: '',
    violation_type: 'Select a Violation Type',
    location: '',
    violation_date: dayjs().format('YYYY-MM-DDTHH:mm'),
    fine_amount: '',
    insurance_policy: '',
    notes: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Enhanced violation types with colors and descriptions
  const violationTypes = [
    { 
      value: 'Select a Violation Type', 
      label: 'Select a Violation Type', 
      fine_amount: 0, 
      icon: <DirectionsCar />,
      color: 'linear-gradient(135deg, #ff00f 0%, #ff9966 100%)',
      description: 'Exceeding posted speed limits'
    },
    { 
      value: 'speeding', 
      label: 'Speeding', 
      fine_amount: 5000, 
      icon: <DirectionsCar />,
      color: 'linear-gradient(135deg, #ff5e62 0%, #ff9966 100%)',
      description: 'Exceeding posted speed limits'
    },
    { 
      value: 'red_light', 
      label: 'Red Light Violation', 
      fine_amount: 7500, 
      icon: <DirectionsCar />,
      color: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
      description: 'Running a red traffic light'
    },
    { 
      value: 'illegal_parking', 
      label: 'Illegal Parking', 
      fine_amount: 3000, 
      icon: <DirectionsCar />,
      color: 'linear-gradient(135deg, #f79d00 0%, #64f38c 100%)',
      description: 'Parking in prohibited areas'
    },
    { 
      value: 'no_seatbelt', 
      label: 'No Seatbelt', 
      fine_amount: 2000, 
      icon: <DirectionsCar />,
      color: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      description: 'Driver or passenger without seatbelt'
    },
    { 
      value: 'no_license', 
      label: 'Driving Without License', 
      fine_amount: 10000, 
      icon: <LocalPolice />,
      color: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
      description: 'Operating vehicle without valid license'
    },
    { 
      value: 'drunk_driving', 
      label: 'Drunk Driving', 
      fine_amount: 20000, 
      icon: <LocalPolice />,
      color: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)',
      description: 'Driving under alcohol influence'
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!hasRole('police')) {
      navigate('/unauthorized');
    }
  }, [isAuthenticated, hasRole, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'violation_type') {
      const selectedViolation = violationTypes.find(v => v.value === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        fine_amount: selectedViolation ? selectedViolation.fine_amount : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requiredFields = ['license_plate', 'violation_type', 'location', 'fine_amount', 'insurance_policy'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill all required fields: ${missingFields.map(f => {
        switch(f) {
          case 'license_plate': return 'License Plate';
          case 'violation_type': return 'Violation Type';
          case 'location': return 'Location';
          case 'fine_amount': return 'Fine Amount';
          case 'insurance_policy': return 'Insurance Policy';
          default: return f;
        }
      }).join(', ')}`);
      return;
    }
    
    if (isNaN(formData.fine_amount) || parseFloat(formData.fine_amount) <= 0) {
      setError('Fine amount must be a positive number');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const payload = {
        ...formData,
        officer_id: user.id,
        fine_amount: parseFloat(formData.fine_amount),
        violation_label: violationTypes.find(v => v.value === formData.violation_type)?.label || formData.violation_type
      };
      
      await api.post('/api/violations', payload);
      setSuccess('Violation recorded successfully!');
      
      // Reset form but keep the date/time
      setFormData({
        license_plate: '',
        violation_type: '',
        location: '',
        violation_date: dayjs().format('YYYY-MM-DDTHH:mm'),
        fine_amount: '',
        insurance_policy: '',
        notes: ''
      });
      
    } catch (err) {
      console.error('Error recording violation:', err);
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to record violation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !hasRole('police')) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Redirecting...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ 
      mt: 4, 
      mb: 6,
      minHeight: '100vh',
      py: 4
    }}>
      <Card sx={{ 
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <CardHeader
          avatar={
            <Avatar sx={{ 
              bgcolor: 'transparent',
              width: 56,
              height: 56,
              background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)'
            }}>
              <LocalPolice sx={{ fontSize: 28, color: 'white' }} />
            </Avatar>
          }
          title={
            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              letterSpacing: -0.5
            }}>
              New Traffic Violation
            </Typography>
          }
          subheader={
            <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
              Record a new traffic violation case
            </Typography>
          }
          sx={{
            py: 3,
            px: 4,
            background: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
          }}
        />
        
        <CardContent sx={{ 
          p: 0,
          background: 'rgba(248, 249, 250, 0.5)'
        }}>
          {(error || success) && (
            <Box sx={{ px: 4, pt: 3 }}>
              {error && (
                <Alert 
                  severity="error" 
                  icon={<Cancel />}
                  sx={{ 
                    mb: 2,
                    borderRadius: 1,
                    alignItems: 'center'
                  }}
                  onClose={() => setError('')}
                >
                  <Typography fontWeight="500">{error}</Typography>
                </Alert>
              )}
              
              {success && (
                <Alert 
                  severity="success" 
                  icon={<CheckCircle />}
                  sx={{ 
                    mb: 2,
                    borderRadius: 1,
                    alignItems: 'center'
                  }}
                  onClose={() => setSuccess('')}
                >
                  <Typography fontWeight="500">{success}</Typography>
                </Alert>
              )}
            </Box>
          )}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            <Grid container spacing={3}>
              {/* License Plate */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="License Plate"
                  name="license_plate"
                  value={formData.license_plate}
                  onChange={handleChange}
                  placeholder="e.g. 123ABC45"
                  inputProps={{ 
                    style: { 
                      textTransform: 'uppercase',
                      fontSize: '1rem',
                      fontWeight: '500'
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <DirectionsCar sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.12)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Violation Type */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel id="violation-type-label" sx={{ 
                    color: 'text.secondary',
                    '&.Mui-focused': {
                      color: 'primary.main'
                    }
                  }}>
                    Violation Type
                  </InputLabel>
                  <Select
                    name="violation_type"
                    value={formData.violation_type}
                    onChange={handleChange}
                    label="Violation Type"
                    labelId="violation-type-label"
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderRadius: 1,
                      minHeight: '56px',
                      '& .MuiOutlinedInput-root': {
                        background: 'white',
                        '& fieldset': {
                          borderColor: 'rgba(0,0,0,0.12)'
                        },
                        '&:hover fieldset': {
                          borderColor: 'primary.main'
                        }
                      },
                      '& .MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        minHeight: 'auto !important'
                      }
                    }}
                    renderValue={(selected) => {
                      if (!selected) {
                        return <Typography color="text.disabled">Select a violation type</Typography>;
                      }
                      const violation = violationTypes.find(v => v.value === selected);
                      return (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          {violation?.icon}
                          <Typography>{violation?.label}</Typography>
                          <Chip 
                            label={`${violation?.fine_amount.toLocaleString()} DZD`} 
                            size="small" 
                            sx={{ 
                              ml: 1,
                              height: 20,
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              background: 'rgba(0,0,0,0.08)'
                            }} 
                          />
                        </Box>
                      );
                    }}
                  >
                    {violationTypes.map((type) => (
                      <MenuItem 
                        key={type.value} 
                        value={type.value} 
                        sx={{ 
                          py: 1.5,
                          m: 0.5,
                          borderRadius: 1,
                          transition: 'all 0.2s',
                          '&:hover': {
                            background: type.color,
                            color: 'white',
                            '& .violation-description': {
                              color: 'rgba(255,255,255,0.8)'
                            }
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, width: '100%' }}>
                          <Box sx={{ 
                            background: type.color,
                            color: 'white',
                            p: 1,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {type.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography fontWeight="600">{type.label}</Typography>
                            <Typography variant="body2" className="violation-description" sx={{ 
                              color: 'text.secondary',
                              fontSize: '0.8rem',
                              mt: 0.5
                            }}>
                              {type.description}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              fontWeight: 600,
                              color: 'primary.main',
                              mt: 1
                            }}>
                              Fine: {type.fine_amount.toLocaleString()} DZD
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              {/* Location */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Main Street, Downtown"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.12)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Date/Time */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Violation Date & Time"
                  name="violation_date"
                  type="datetime-local"
                  value={formData.violation_date}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.12)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Fine Amount */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Fine Amount"
                  name="fine_amount"
                  type="number"
                  value={formData.fine_amount}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  placeholder="Enter amount in DZD"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MonetizationOn sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="body2" color="text.secondary">
                          DZD
                        </Typography>
                      </InputAdornment>
                    )
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.12)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Insurance Policy */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Insurance Policy Number"
                  name="insurance_policy"
                  value={formData.insurance_policy}
                  onChange={handleChange}
                  placeholder="e.g. INS-12345678"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Receipt sx={{ color: 'action.active' }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      background: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.12)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  placeholder="Enter any additional details about the violation..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Notes sx={{ 
                          color: 'action.active',
                          mt: 0.5,
                          alignSelf: 'flex-start'
                        }} />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      background: 'white',
                      alignItems: 'flex-start',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.12)'
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main'
                      }
                    }
                  }}
                />
              </Grid>
              
              {/* Buttons */}
              <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: 2,
                  mt: 2
                }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/police')}
                    sx={{ 
                      px: 4,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      borderWidth: 1,
                      '&:hover': {
                        borderWidth: 1,
                        background: 'rgba(0,0,0,0.02)'
                      }
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ 
                      px: 4,
                      py: 1,
                      borderRadius: 1,
                      textTransform: 'none',
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 80%)',
                        boxShadow: '0 2px 8px rgba(58, 123, 213, 0.4)'
                      },
                      '&:disabled': {
                        background: 'rgba(0,0,0,0.12)'
                      }
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {loading ? 'Processing...' : 'Submit Violation'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ViolationEntryPage;