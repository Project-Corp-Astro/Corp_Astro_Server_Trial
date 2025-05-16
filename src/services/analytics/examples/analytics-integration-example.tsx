import React, { useEffect, useState } from 'react';
import CorpAstroAnalytics from '../sdk/AnalyticsSDK';
import { Button, Card, Container, Typography, Box, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Paper, Divider, Snackbar, Alert } from '@mui/material';

/**
 * This component demonstrates how to integrate the Corp Astro Analytics SDK
 * into a React application. It shows practical examples of tracking various
 * events and interactions that are relevant to the Corp Astro application.
 */

// Initialize the analytics SDK
const analytics = new CorpAstroAnalytics({
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000/api/analytics',
  debug: process.env.NODE_ENV === 'development',
  batchSize: 5,
  batchInterval: 10000, // 10 seconds
});

// Mock user data for demonstration
const MOCK_USER = {
  id: 'user-123',
  name: 'Test User',
  email: 'test@example.com',
  subscriptionTier: 'basic' as 'free' | 'basic' | 'pro' | 'enterprise',
};

// Mock business data for demonstration
const MOCK_BUSINESSES = [
  { id: 'business-1', name: 'Cosmic Enterprises' },
  { id: 'business-2', name: 'Astral Innovations' },
  { id: 'business-3', name: 'Zodiac Solutions' },
];

const AnalyticsIntegrationExample: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(MOCK_BUSINESSES[0]);
  const [chartType, setChartType] = useState<'natal' | 'transit' | 'synastry' | 'composite' | 'progressed' | 'dasha'>('natal');
  const [horoscopeType, setHoroscopeType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [forecastType, setForecastType] = useState<'financial' | 'strategic' | 'team' | 'general'>('financial');
  const [forecastPeriod, setForecastPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  const [toolName, setToolName] = useState<'name_analysis' | 'tagline_analysis' | 'color_analysis' | 'logo_analysis'>('name_analysis');
  const [toolInput, setToolInput] = useState('');
  const [abTestVariant, setAbTestVariant] = useState<string | null>(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Set up analytics when the component mounts
  useEffect(() => {
    // Clean up when component unmounts
    return () => {
      analytics.dispose();
    };
  }, []);

  // Simulate user login
  const handleLogin = () => {
    // Set user ID in analytics
    analytics.setUserId(MOCK_USER.id);
    
    // Track login event
    analytics.trackEvent(
      'user_login',
      'authentication',
      'login_success',
      { method: 'email', user_tier: MOCK_USER.subscriptionTier }
    );
    
    setIsLoggedIn(true);
    showNotification('Logged in successfully. User ID set in analytics.');
  };

  // Simulate user logout
  const handleLogout = () => {
    // Track logout event
    analytics.trackEvent(
      'user_logout',
      'authentication',
      'logout',
      { session_duration: Math.floor(Math.random() * 3600) }
    );
    
    setIsLoggedIn(false);
    showNotification('Logged out successfully. Analytics event tracked.');
  };

  // Track chart generation
  const handleGenerateChart = () => {
    if (!isLoggedIn) {
      showNotification('Please log in first', 'error');
      return;
    }
    
    const startTime = Date.now();
    
    // Simulate chart generation delay
    setTimeout(() => {
      const generationTime = Date.now() - startTime;
      
      analytics.trackChartGeneration(
        chartType,
        selectedBusiness.id,
        generationTime,
        {
          houses: 12,
          zodiac_system: 'sidereal',
          ayanamsa: 'lahiri',
          chart_date: new Date().toISOString()
        }
      );
      
      showNotification(`${chartType} chart generated and tracked`);
    }, 1500);
  };

  // Track horoscope view
  const handleViewHoroscope = () => {
    if (!isLoggedIn) {
      showNotification('Please log in first', 'error');
      return;
    }
    
    analytics.trackHoroscopeView(
      horoscopeType,
      MOCK_USER.subscriptionTier,
      `horoscope-${horoscopeType}-${Date.now()}`
    );
    
    showNotification(`${horoscopeType} horoscope view tracked`);
  };

  // Track business forecast
  const handleViewForecast = () => {
    if (!isLoggedIn) {
      showNotification('Please log in first', 'error');
      return;
    }
    
    analytics.trackBusinessForecast(
      selectedBusiness.id,
      forecastType,
      forecastPeriod,
      `forecast-${forecastType}-${forecastPeriod}-${Date.now()}`
    );
    
    showNotification(`${forecastType} ${forecastPeriod} forecast tracked for ${selectedBusiness.name}`);
  };

  // Track free tool usage
  const handleUseTool = () => {
    if (!isLoggedIn) {
      showNotification('Please log in first', 'error');
      return;
    }
    
    if (!toolInput) {
      showNotification('Please enter input for the tool', 'error');
      return;
    }
    
    const startTime = Date.now();
    
    // Simulate tool processing
    setTimeout(() => {
      const usageDuration = Date.now() - startTime;
      
      analytics.trackFreeToolUsage(
        toolName,
        { input: toolInput },
        { result: `Analyzed ${toolInput} with ${toolName}`, score: Math.floor(Math.random() * 100) },
        usageDuration
      );
      
      showNotification(`${toolName} usage tracked`);
      setToolInput('');
    }, 1000);
  };

  // Track subscription change
  const handleUpgradeSubscription = () => {
    if (!isLoggedIn) {
      showNotification('Please log in first', 'error');
      return;
    }
    
    const previousTier = MOCK_USER.subscriptionTier;
    const newTier = previousTier === 'basic' ? 'pro' : 'enterprise';
    
    analytics.trackSubscriptionChange(
      previousTier,
      newTier,
      'upgrade'
    );
    
    MOCK_USER.subscriptionTier = newTier;
    showNotification(`Subscription upgraded from ${previousTier} to ${newTier}`);
  };

  // Get A/B test variant
  const handleGetABTestVariant = async () => {
    if (!isLoggedIn) {
      showNotification('Please log in first', 'error');
      return;
    }
    
    try {
      const variant = await analytics.getABTestVariant('onboarding_flow');
      setAbTestVariant(variant);
      showNotification(`A/B test variant: ${variant}`);
    } catch (error) {
      showNotification('Error getting A/B test variant', 'error');
    }
  };

  // Track A/B test conversion
  const handleTrackConversion = () => {
    if (!isLoggedIn || !abTestVariant) {
      showNotification('Please log in and get a variant first', 'error');
      return;
    }
    
    analytics.trackABTestConversion('onboarding_flow', 1);
    showNotification('A/B test conversion tracked');
  };

  // Track UI interaction
  const handleCardClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isLoggedIn) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    analytics.trackUIInteraction(
      x,
      y,
      rect.width,
      rect.height,
      'click',
      window.location.pathname
    );
    
    showNotification('UI interaction tracked', 'success', 1000);
  };

  // Helper function to show notifications
  const showNotification = (message: string, severity: 'success' | 'error' = 'success', duration = 3000) => {
    setNotification({ open: true, message, severity });
    setTimeout(() => {
      setNotification({ ...notification, open: false });
    }, duration);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Corp Astro Analytics Integration Example
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          User Authentication
        </Typography>
        <Box sx={{ mb: 2 }}>
          {!isLoggedIn ? (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleLogin}
            >
              Log In (Sets User ID)
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={handleLogout}
            >
              Log Out
            </Button>
          )}
        </Box>
        
        <Typography variant="body2" color="textSecondary">
          {isLoggedIn 
            ? `Logged in as ${MOCK_USER.name} (${MOCK_USER.id}) - ${MOCK_USER.subscriptionTier} tier` 
            : 'Not logged in'}
        </Typography>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Chart Generation */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }} onClick={handleCardClick}>
            <Typography variant="h6" gutterBottom>
              Chart Generation
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Chart Type</InputLabel>
              <Select
                value={chartType}
                label="Chart Type"
                onChange={(e) => setChartType(e.target.value as any)}
              >
                <MenuItem value="natal">Natal Chart</MenuItem>
                <MenuItem value="transit">Transit Chart</MenuItem>
                <MenuItem value="synastry">Synastry Chart</MenuItem>
                <MenuItem value="composite">Composite Chart</MenuItem>
                <MenuItem value="progressed">Progressed Chart</MenuItem>
                <MenuItem value="dasha">Dasha Chart</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Business</InputLabel>
              <Select
                value={selectedBusiness.id}
                label="Business"
                onChange={(e) => {
                  const business = MOCK_BUSINESSES.find(b => b.id === e.target.value);
                  if (business) setSelectedBusiness(business);
                }}
              >
                {MOCK_BUSINESSES.map(business => (
                  <MenuItem key={business.id} value={business.id}>
                    {business.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleGenerateChart}
              disabled={!isLoggedIn}
            >
              Generate Chart
            </Button>
          </Card>
        </Grid>
        
        {/* Horoscope View */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }} onClick={handleCardClick}>
            <Typography variant="h6" gutterBottom>
              Horoscope View
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Horoscope Type</InputLabel>
              <Select
                value={horoscopeType}
                label="Horoscope Type"
                onChange={(e) => setHoroscopeType(e.target.value as any)}
              >
                <MenuItem value="daily">Daily Horoscope</MenuItem>
                <MenuItem value="weekly">Weekly Horoscope</MenuItem>
                <MenuItem value="monthly">Monthly Horoscope</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleViewHoroscope}
              disabled={!isLoggedIn}
            >
              View Horoscope
            </Button>
          </Card>
        </Grid>
        
        {/* Business Forecast */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }} onClick={handleCardClick}>
            <Typography variant="h6" gutterBottom>
              Business Forecast
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Forecast Type</InputLabel>
              <Select
                value={forecastType}
                label="Forecast Type"
                onChange={(e) => setForecastType(e.target.value as any)}
              >
                <MenuItem value="financial">Financial Forecast</MenuItem>
                <MenuItem value="strategic">Strategic Forecast</MenuItem>
                <MenuItem value="team">Team Forecast</MenuItem>
                <MenuItem value="general">General Forecast</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Forecast Period</InputLabel>
              <Select
                value={forecastPeriod}
                label="Forecast Period"
                onChange={(e) => setForecastPeriod(e.target.value as any)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="quarterly">Quarterly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleViewForecast}
              disabled={!isLoggedIn}
            >
              View Forecast
            </Button>
          </Card>
        </Grid>
        
        {/* Free Tool Usage */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }} onClick={handleCardClick}>
            <Typography variant="h6" gutterBottom>
              Free Tool Usage
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tool</InputLabel>
              <Select
                value={toolName}
                label="Tool"
                onChange={(e) => setToolName(e.target.value as any)}
              >
                <MenuItem value="name_analysis">Name Number Analysis</MenuItem>
                <MenuItem value="tagline_analysis">Tagline Analysis</MenuItem>
                <MenuItem value="color_analysis">Brand Color Analysis</MenuItem>
                <MenuItem value="logo_analysis">Logo Analysis</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Input"
              value={toolInput}
              onChange={(e) => setToolInput(e.target.value)}
              sx={{ mb: 2 }}
              placeholder={`Enter ${toolName.replace('_', ' ')}`}
            />
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleUseTool}
              disabled={!isLoggedIn}
            >
              Use Tool
            </Button>
          </Card>
        </Grid>
        
        {/* Subscription Change */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }} onClick={handleCardClick}>
            <Typography variant="h6" gutterBottom>
              Subscription Management
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Current tier: {MOCK_USER.subscriptionTier}
            </Typography>
            
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={handleUpgradeSubscription}
              disabled={!isLoggedIn || MOCK_USER.subscriptionTier === 'enterprise'}
            >
              Upgrade Subscription
            </Button>
          </Card>
        </Grid>
        
        {/* A/B Testing */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 2 }} onClick={handleCardClick}>
            <Typography variant="h6" gutterBottom>
              A/B Testing
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                onClick={handleGetABTestVariant}
                disabled={!isLoggedIn}
                sx={{ mb: 1 }}
              >
                Get A/B Test Variant
              </Button>
              
              {abTestVariant && (
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Current variant: <strong>{abTestVariant}</strong>
                </Typography>
              )}
              
              <Button 
                variant="contained" 
                color="secondary" 
                fullWidth
                onClick={handleTrackConversion}
                disabled={!isLoggedIn || !abTestVariant}
              >
                Track Conversion
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body2" color="textSecondary">
          This example demonstrates how to integrate the Corp Astro Analytics SDK into your application.
          All events are tracked using the SDK and sent to the analytics API.
        </Typography>
      </Box>
      
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AnalyticsIntegrationExample;
