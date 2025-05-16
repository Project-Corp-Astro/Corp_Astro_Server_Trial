import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getAstrologyFeatureAnalytics } from '../utils/astrologyMetrics';
import { getSubscriptionAnalytics, getSubscriptionFunnelMetrics } from '../utils/subscriptionAnalytics';

// Color palette
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];

// Mock data for demonstration
const mockBusinessMetrics = {
  // Business chart usage by type
  chartUsage: [
    { name: 'Business Natal', count: 320 },
    { name: 'Financial Transit', count: 280 },
    { name: 'Team Compatibility', count: 180 },
    { name: 'Strategic Planning', count: 150 },
    { name: 'Investment Timing', count: 120 }
  ],
  
  // Business forecast usage by type
  forecastUsage: [
    { name: 'Financial', count: 250 },
    { name: 'Strategic', count: 200 },
    { name: 'Team', count: 150 },
    { name: 'General', count: 180 }
  ],
  
  // Subscription distribution
  subscriptionTiers: [
    { name: 'Free', value: 65 },
    { name: 'Basic', value: 20 },
    { name: 'Pro', value: 10 },
    { name: 'Enterprise', value: 5 }
  ],
  
  // Monthly revenue trend
  revenueByMonth: [
    { month: 'Jan', revenue: 2500 },
    { month: 'Feb', revenue: 3200 },
    { month: 'Mar', revenue: 4000 },
    { month: 'Apr', revenue: 4800 },
    { month: 'May', revenue: 5500 },
    { month: 'Jun', revenue: 6200 }
  ],
  
  // Conversion rates by business type
  conversionByBusinessType: [
    { type: 'Startup', rate: 8.2 },
    { type: 'Small Business', rate: 12.5 },
    { type: 'Enterprise', rate: 6.8 },
    { type: 'Freelance', rate: 9.3 },
    { type: 'Non-Profit', rate: 5.4 }
  ],
  
  // Key metrics
  keyMetrics: {
    totalBusinesses: 850,
    activeBusinesses: 620,
    averageRevenuePerBusiness: 42.50,
    monthlyRecurringRevenue: 26350,
    conversionRate: 9.8,
    retentionRate: 87.5
  }
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`business-metrics-tabpanel-${index}`}
      aria-labelledby={`business-metrics-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `business-metrics-tab-${index}`,
    'aria-controls': `business-metrics-tabpanel-${index}`,
  };
}

const BusinessAstrologyKPIDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [metrics, setMetrics] = useState(mockBusinessMetrics);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
    setLoading(true);
    
    // Simulate data loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // In a real implementation, this would fetch data from your API
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real implementation, you would call your API here
      // const startDate = calculateStartDate(timeRange);
      // const endDate = new Date();
      // const data = await fetchBusinessMetrics(startDate, endDate);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  return (
    <Box sx={{ width: '100%' }}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2">
          Corp Astro Business Metrics Dashboard
        </Typography>
        <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            onChange={handleTimeRangeChange as any}
            label="Time Range"
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
            <MenuItem value="6m">Last 6 months</MenuItem>
            <MenuItem value="1y">Last year</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="business metrics dashboard tabs"
      >
        <Tab label="Key Metrics" {...a11yProps(0)} />
        <Tab label="Business Charts" {...a11yProps(1)} />
        <Tab label="Forecasts" {...a11yProps(2)} />
        <Tab label="Revenue" {...a11yProps(3)} />
      </Tabs>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Business Astrology Key Performance Indicators
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Business Accounts
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                    <Typography variant="h3">
                      {metrics.keyMetrics.totalBusinesses}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {metrics.keyMetrics.activeBusinesses} active
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Monthly Recurring Revenue
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                    <Typography variant="h3">
                      ${metrics.keyMetrics.monthlyRecurringRevenue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      ${metrics.keyMetrics.averageRevenuePerBusiness} per business
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                    Conversion Rate
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-end">
                    <Typography variant="h3">
                      {metrics.keyMetrics.conversionRate}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {metrics.keyMetrics.retentionRate}% retention
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Subscription Distribution
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={metrics.subscriptionTiers}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {metrics.subscriptionTiers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Conversion by Business Type
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={metrics.conversionByBusinessType}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rate" name="Conversion Rate (%)" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Business Chart Usage by Type
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={metrics.chartUsage}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Usage Count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Chart Usage Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Most Popular Chart
                      </Typography>
                      <Typography variant="h5">
                        {metrics.chartUsage.reduce((max, item) => max.count > item.count ? max : item, { name: '', count: 0 }).name}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Total Charts Generated
                      </Typography>
                      <Typography variant="h5">
                        {metrics.chartUsage.reduce((sum, item) => sum + item.count, 0)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Charts Per Business
                      </Typography>
                      <Typography variant="h5">
                        {(metrics.chartUsage.reduce((sum, item) => sum + item.count, 0) / metrics.keyMetrics.activeBusinesses).toFixed(1)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Business Forecast Usage by Type
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={metrics.forecastUsage}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Usage Count" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Forecast Usage Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Most Popular Forecast
                      </Typography>
                      <Typography variant="h5">
                        {metrics.forecastUsage.reduce((max, item) => max.count > item.count ? max : item, { name: '', count: 0 }).name}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Total Forecasts Generated
                      </Typography>
                      <Typography variant="h5">
                        {metrics.forecastUsage.reduce((sum, item) => sum + item.count, 0)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Forecasts Per Business
                      </Typography>
                      <Typography variant="h5">
                        {(metrics.forecastUsage.reduce((sum, item) => sum + item.count, 0) / metrics.keyMetrics.activeBusinesses).toFixed(1)}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
          
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Monthly Revenue Trend
                    </Typography>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart
                        data={metrics.revenueByMonth}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" name="Monthly Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Revenue Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Current MRR
                      </Typography>
                      <Typography variant="h5">
                        ${metrics.keyMetrics.monthlyRecurringRevenue.toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Revenue Growth
                      </Typography>
                      <Typography variant="h5">
                        {((metrics.revenueByMonth[metrics.revenueByMonth.length - 1].revenue / 
                          metrics.revenueByMonth[0].revenue - 1) * 100).toFixed(1)}%
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        ARPU
                      </Typography>
                      <Typography variant="h5">
                        ${metrics.keyMetrics.averageRevenuePerBusiness}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="textSecondary">
                        Projected Annual
                      </Typography>
                      <Typography variant="h5">
                        ${(metrics.keyMetrics.monthlyRecurringRevenue * 12).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </TabPanel>
        </>
      )}
    </Box>
  );
};

export default BusinessAstrologyKPIDashboard;
