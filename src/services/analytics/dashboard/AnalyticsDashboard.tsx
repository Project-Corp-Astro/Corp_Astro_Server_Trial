import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Tabs, 
  Tab, 
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import axios from 'axios';

// Types
interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  date: string;
  value: number;
}

interface MetricsData {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  chartGenerations: number;
  horoscopeViews: number;
  businessForecasts: number;
  freeToolUsage: number;
  subscriptionConversions: number;
  aiChatInteractions: number;
  chartGenerationsByType: ChartData[];
  horoscopeViewsByType: ChartData[];
  freeToolUsageByType: ChartData[];
  userGrowth: TimeSeriesData[];
  featureUsageOverTime: TimeSeriesData[];
  subscriptionsByTier: ChartData[];
  abTestResults: {
    testName: string;
    variants: {
      name: string;
      impressions: number;
      conversions: number;
      conversionRate: number;
    }[];
  }[];
}

// Dashboard Component
const AnalyticsDashboard: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date()
  });
  const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Fetch data when date range or subscription filter changes
  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, subscriptionFilter]);

  // Fetch analytics data from API
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Format dates for API
      const startDateStr = dateRange.startDate.toISOString().split('T')[0];
      const endDateStr = dateRange.endDate.toISOString().split('T')[0];
      
      // Fetch metrics from API
      const response = await axios.get('/api/analytics/metrics/astrology', {
        params: {
          startDate: startDateStr,
          endDate: endDateStr,
          subscriptionTier: subscriptionFilter !== 'all' ? subscriptionFilter : undefined
        }
      });
      
      setMetricsData(response.data.metrics);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Render loading state
  if (loading && !metricsData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading analytics data...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh" flexDirection="column">
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchAnalyticsData}>
          Retry
        </Button>
      </Box>
    );
  }

  // Use mock data if no data is available yet
  const data = metricsData || {
    totalUsers: 1250,
    activeUsers: 780,
    newUsers: 125,
    chartGenerations: 3420,
    horoscopeViews: 8750,
    businessForecasts: 1890,
    freeToolUsage: 2340,
    subscriptionConversions: 87,
    aiChatInteractions: 1560,
    chartGenerationsByType: [
      { name: 'Natal', value: 1200, color: '#0088FE' },
      { name: 'Transit', value: 800, color: '#00C49F' },
      { name: 'Synastry', value: 600, color: '#FFBB28' },
      { name: 'Composite', value: 300, color: '#FF8042' },
      { name: 'Progressed', value: 250, color: '#8884d8' },
      { name: 'Dasha', value: 270, color: '#82ca9d' }
    ],
    horoscopeViewsByType: [
      { name: 'Daily', value: 5200, color: '#0088FE' },
      { name: 'Weekly', value: 2300, color: '#00C49F' },
      { name: 'Monthly', value: 1250, color: '#FFBB28' }
    ],
    freeToolUsageByType: [
      { name: 'Name Analysis', value: 980, color: '#0088FE' },
      { name: 'Tagline Analysis', value: 750, color: '#00C49F' },
      { name: 'Color Analysis', value: 420, color: '#FFBB28' },
      { name: 'Logo Analysis', value: 190, color: '#FF8042' }
    ],
    userGrowth: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 1000 + Math.floor(Math.random() * 50) * (i + 1)
    })),
    featureUsageOverTime: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      value: 300 + Math.floor(Math.random() * 100) * (i / 5)
    })),
    subscriptionsByTier: [
      { name: 'Free', value: 850, color: '#0088FE' },
      { name: 'Basic', value: 250, color: '#00C49F' },
      { name: 'Pro', value: 120, color: '#FFBB28' },
      { name: 'Enterprise', value: 30, color: '#FF8042' }
    ],
    abTestResults: [
      {
        testName: 'Onboarding Flow',
        variants: [
          { name: 'Control', impressions: 1000, conversions: 150, conversionRate: 15 },
          { name: 'Simplified', impressions: 1000, conversions: 180, conversionRate: 18 },
          { name: 'Video Intro', impressions: 1000, conversions: 220, conversionRate: 22 }
        ]
      },
      {
        testName: 'Subscription Page',
        variants: [
          { name: 'Standard', impressions: 800, conversions: 40, conversionRate: 5 },
          { name: 'Benefits Focused', impressions: 800, conversions: 64, conversionRate: 8 }
        ]
      }
    ]
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Corp Astro Analytics Dashboard
        </Typography>
        
        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={(newValue) => {
                  if (newValue) {
                    setDateRange({ ...dateRange, startDate: newValue });
                  }
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={(newValue) => {
                  if (newValue) {
                    setDateRange({ ...dateRange, endDate: newValue });
                  }
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Subscription Tier</InputLabel>
                <Select
                  value={subscriptionFilter}
                  label="Subscription Tier"
                  onChange={(e) => setSubscriptionFilter(e.target.value)}
                >
                  <MenuItem value="all">All Tiers</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="basic">Basic</MenuItem>
                  <MenuItem value="pro">Pro</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Overview" />
            <Tab label="User Growth" />
            <Tab label="Feature Usage" />
            <Tab label="Astrology Metrics" />
            <Tab label="A/B Tests" />
          </Tabs>
        </Paper>
        
        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            {/* Key Metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Users
                    </Typography>
                    <Typography variant="h4">{data.totalUsers.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Active Users
                    </Typography>
                    <Typography variant="h4">{data.activeUsers.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      New Users
                    </Typography>
                    <Typography variant="h4">{data.newUsers.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Subscription Conversions
                    </Typography>
                    <Typography variant="h4">{data.subscriptionConversions.toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Charts */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    User Growth
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" name="Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
                    Subscriptions by Tier
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.subscriptionsByTier}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.subscriptionsByTier.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 1 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    User Growth Over Time
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data.userGrowth}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" name="Total Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    New User Acquisition
                  </Typography>
                  <Typography variant="body1" paragraph>
                    In the selected period, we acquired <strong>{data.newUsers}</strong> new users.
                  </Typography>
                  <Typography variant="body1" paragraph>
                    This represents a <strong>{((data.newUsers / data.totalUsers) * 100).toFixed(1)}%</strong> growth in our user base.
                  </Typography>
                  <Typography variant="body1">
                    User retention rate: <strong>78%</strong>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Subscription Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.subscriptionsByTier}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Users" fill="#8884d8">
                        {data.subscriptionsByTier.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 2 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Feature Usage Over Time
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data.featureUsageOverTime}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="#82ca9d" name="Feature Usage" />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Chart Generations
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.chartGenerationsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.chartGenerationsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Total: {data.chartGenerations.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Horoscope Views
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.horoscopeViewsByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.horoscopeViewsByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Total: {data.horoscopeViews.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Free Tool Usage
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.freeToolUsageByType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.freeToolUsageByType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                    Total: {data.freeToolUsage.toLocaleString()}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 3 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Astrology Feature Usage
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'Charts', value: data.chartGenerations },
                        { name: 'Horoscopes', value: data.horoscopeViews },
                        { name: 'Forecasts', value: data.businessForecasts },
                        { name: 'Free Tools', value: data.freeToolUsage },
                        { name: 'AI Chat', value: data.aiChatInteractions }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Usage Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Business Forecast Metrics
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Total business forecasts generated: <strong>{data.businessForecasts.toLocaleString()}</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Average forecasts per business: <strong>4.2</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Most popular forecast type: <strong>Financial</strong>
                  </Typography>
                  <Typography variant="body1">
                    Most popular forecast period: <strong>Monthly</strong>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Astro Ratan AI Chat Metrics
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Total AI chat interactions: <strong>{data.aiChatInteractions.toLocaleString()}</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Average messages per conversation: <strong>8.3</strong>
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Average user satisfaction score: <strong>4.2/5</strong>
                  </Typography>
                  <Typography variant="body1">
                    Most common topics: <strong>Business timing, Team compatibility, Strategic decisions</strong>
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {activeTab === 4 && (
          <Box>
            <Grid container spacing={3}>
              {data.abTestResults.map((test, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {test.testName}
                    </Typography>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={test.variants}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="impressions" fill="#8884d8" name="Impressions" />
                        <Bar yAxisId="left" dataKey="conversions" fill="#82ca9d" name="Conversions" />
                        <Bar yAxisId="right" dataKey="conversionRate" fill="#ffc658" name="Conversion Rate (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1">
                        Winner: <strong>{test.variants.sort((a, b) => b.conversionRate - a.conversionRate)[0].name}</strong> with a conversion rate of <strong>{test.variants.sort((a, b) => b.conversionRate - a.conversionRate)[0].conversionRate}%</strong>
                      </Typography>
                      <Typography variant="body1">
                        Improvement over control: <strong>{((test.variants.sort((a, b) => b.conversionRate - a.conversionRate)[0].conversionRate / test.variants.find(v => v.name === 'Control' || v.name === 'Standard')!.conversionRate - 1) * 100).toFixed(1)}%</strong>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </LocalizationProvider>
  );
};

export default AnalyticsDashboard;
