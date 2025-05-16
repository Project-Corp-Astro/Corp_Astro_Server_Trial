import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, subDays } from 'date-fns';

// Import tab components
import OverviewTab from './dashboard-tabs/OverviewTab';
import EngagementTab from './dashboard-tabs/EngagementTab';
import FeaturesTab from './dashboard-tabs/FeaturesTab';
import ABTestsTab from './dashboard-tabs/ABTestsTab';
import JourneysTab from './dashboard-tabs/JourneysTab';
import RealtimeTab from './dashboard-tabs/RealtimeTab';

// API base URL
const API_BASE_URL = '/api/analytics/dashboard/api';

// Dashboard tabs
enum DashboardTab {
  OVERVIEW = 0,
  ENGAGEMENT = 1,
  FEATURES = 2,
  ABTESTS = 3,
  JOURNEYS = 4,
  REALTIME = 5
}

// Dashboard component
const SuperAdminAnalyticsDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [overviewData, setOverviewData] = useState<any>(null);
  const [engagementData, setEngagementData] = useState<any>(null);
  const [featureData, setFeatureData] = useState<any>(null);
  const [abTestData, setAbTestData] = useState<any>(null);
  const [journeyData, setJourneyData] = useState<any>(null);
  const [realtimeData, setRealtimeData] = useState<any>(null);
  
  // Filter state
  const [selectedFeatureCategory, setSelectedFeatureCategory] = useState<string>('');
  const [selectedTestName, setSelectedTestName] = useState<string>('onboarding_flow');
  const [selectedJourneyName, setSelectedJourneyName] = useState<string>('all');
  
  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  // Fetch overview data
  const fetchOverviewData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/overview`, {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });
      
      setOverviewData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch overview data');
      console.error('Error fetching overview data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch engagement data
  const fetchEngagementData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/engagement`, {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });
      
      setEngagementData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch engagement data');
      console.error('Error fetching engagement data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch feature data
  const fetchFeatureData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/features`, {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          category: selectedFeatureCategory || undefined
        }
      });
      
      setFeatureData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch feature data');
      console.error('Error fetching feature data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch AB test data
  const fetchABTestData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/abtests/${selectedTestName}`, {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });
      
      setAbTestData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch A/B test data');
      console.error('Error fetching A/B test data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch journey data
  const fetchJourneyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/journeys/${selectedJourneyName}`, {
        params: {
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      });
      
      setJourneyData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch journey data');
      console.error('Error fetching journey data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch realtime data
  const fetchRealtimeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/realtime`);
      
      setRealtimeData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch realtime data');
      console.error('Error fetching realtime data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data based on active tab
  const fetchData = () => {
    switch (activeTab) {
      case DashboardTab.OVERVIEW:
        fetchOverviewData();
        break;
      case DashboardTab.ENGAGEMENT:
        fetchEngagementData();
        break;
      case DashboardTab.FEATURES:
        fetchFeatureData();
        break;
      case DashboardTab.ABTESTS:
        fetchABTestData();
        break;
      case DashboardTab.JOURNEYS:
        fetchJourneyData();
        break;
      case DashboardTab.REALTIME:
        fetchRealtimeData();
        break;
    }
  };
  
  // Effect to fetch data when tab or date range changes
  useEffect(() => {
    fetchData();
    
    // Set up realtime polling if on realtime tab
    let intervalId: NodeJS.Timeout | null = null;
    
    if (activeTab === DashboardTab.REALTIME) {
      intervalId = setInterval(() => {
        fetchRealtimeData();
      }, 15000); // Poll every 15 seconds
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeTab, startDate, endDate, selectedFeatureCategory, selectedTestName, selectedJourneyName]);
  
  // Render loading state
  if (loading && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', maxWidth: 500 }}>
          <Typography variant="h6" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" color="primary" onClick={fetchData} sx={{ mt: 2 }}>
            Retry
          </Button>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          View and analyze data from your mobile applications
        </Typography>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Overview" />
          <Tab label="Engagement" />
          <Tab label="Features" />
          <Tab label="A/B Tests" />
          <Tab label="User Journeys" />
          <Tab label="Real-time" />
        </Tabs>
      </Box>
      
      {/* Date range picker (hide for realtime tab) */}
      {activeTab !== DashboardTab.REALTIME && (
        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={(newValue) => newValue && setStartDate(newValue)}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={(newValue) => newValue && setEndDate(newValue)}
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={fetchData} sx={{ ml: 2 }}>
            Apply
          </Button>
        </Box>
      )}
      
      {/* Tab content */}
      {activeTab === DashboardTab.OVERVIEW && overviewData && (
        <OverviewTab data={overviewData} />
      )}
      
      {activeTab === DashboardTab.ENGAGEMENT && engagementData && (
        <EngagementTab data={engagementData} />
      )}
      
      {activeTab === DashboardTab.FEATURES && (
        <FeaturesTab 
          data={featureData} 
          selectedCategory={selectedFeatureCategory}
          onCategoryChange={(category) => setSelectedFeatureCategory(category)}
        />
      )}
      
      {activeTab === DashboardTab.ABTESTS && (
        <ABTestsTab 
          data={abTestData} 
          selectedTest={selectedTestName}
          onTestChange={(testName) => setSelectedTestName(testName)}
        />
      )}
      
      {activeTab === DashboardTab.JOURNEYS && (
        <JourneysTab 
          data={journeyData} 
          selectedJourney={selectedJourneyName}
          onJourneyChange={(journeyName) => setSelectedJourneyName(journeyName)}
        />
      )}
      
      {activeTab === DashboardTab.REALTIME && realtimeData && (
        <RealtimeTab data={realtimeData} />
      )}
    </Container>
  );
};

export default SuperAdminAnalyticsDashboard;
