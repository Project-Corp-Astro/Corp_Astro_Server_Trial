import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { 
  Container, Grid, Paper, Typography, 
  FormControl, InputLabel, Select, MenuItem,
  Box, Card, CardContent, Divider, Tab, Tabs
} from '@mui/material';

// Sample data - in a real implementation, this would come from your API
const sampleData = {
  userMetrics: {
    totalUsers: 12580,
    activeUsers: 8745,
    newUsers: 1250,
    churnRate: 3.2
  },
  subscriptionMetrics: {
    totalSubscribers: 5840,
    conversionRate: 46.4,
    averageRevenue: 24.99,
    lifetimeValue: 450
  },
  monthlyUsers: [
    { month: 'Jan', users: 7500, newUsers: 950, activeUsers: 6200 },
    { month: 'Feb', users: 8200, newUsers: 1100, activeUsers: 6800 },
    { month: 'Mar', users: 9100, newUsers: 1300, activeUsers: 7200 },
    { month: 'Apr', users: 10200, newUsers: 1500, activeUsers: 7800 },
    { month: 'May', users: 11400, newUsers: 1400, activeUsers: 8300 },
    { month: 'Jun', users: 12580, newUsers: 1250, activeUsers: 8745 }
  ],
  subscriptionTiers: [
    { name: 'Free', value: 6740 },
    { name: 'Basic', value: 2950 },
    { name: 'Pro', value: 2100 },
    { name: 'Enterprise', value: 790 }
  ],
  featureUsage: [
    { name: 'Natal Chart', usage: 15240 },
    { name: 'Daily Horoscope', usage: 42560 },
    { name: 'Business Forecast', usage: 8920 },
    { name: 'Compatibility', usage: 7450 },
    { name: 'Transit Report', usage: 5230 }
  ],
  conversionFunnel: [
    { stage: 'Visitors', count: 25000 },
    { stage: 'Signup', count: 12580 },
    { stage: 'Free Trial', count: 8200 },
    { stage: 'Subscription', count: 5840 }
  ],
  retentionData: [
    { cohort: 'Jan', day1: 100, day7: 85, day30: 72, day60: 64, day90: 58 },
    { cohort: 'Feb', day1: 100, day7: 82, day30: 70, day60: 61, day90: 55 },
    { cohort: 'Mar', day1: 100, day7: 88, day30: 75, day60: 67, day90: 60 },
    { cohort: 'Apr', day1: 100, day7: 90, day30: 78, day60: 70, day90: 63 },
    { cohort: 'May', day1: 100, day7: 92, day30: 80, day60: 72, day90: null },
    { cohort: 'Jun', day1: 100, day7: 94, day30: 82, day60: null, day90: null }
  ]
};

// Custom dashboard component
const CorpAstroDashboard = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [tabValue, setTabValue] = useState(0);
  const [data, setData] = useState(sampleData);

  // In a real implementation, this would fetch data from your API
  useEffect(() => {
    // Simulating API call
    const fetchData = async () => {
      // In a real implementation:
      // const response = await fetch(`/api/analytics/dashboard?timeRange=${timeRange}`);
      // const data = await response.json();
      // setData(data);
      
      // For this example, we're just using the sample data
      setData(sampleData);
    };
    
    fetchData();
  }, [timeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Corp Astro Analytics
        </Typography>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            label="Time Range"
          >
            <MenuItem value="7d">Last 7 days</MenuItem>
            <MenuItem value="30d">Last 30 days</MenuItem>
            <MenuItem value="90d">Last 90 days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
          <Tab label="Overview" />
          <Tab label="User Analytics" />
          <Tab label="Subscription Analytics" />
          <Tab label="Feature Usage" />
          <Tab label="Retention" />
        </Tabs>
      </Box>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <>
          {/* Key Metrics */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" color="textSecondary">
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {data.userMetrics.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.userMetrics.newUsers.toLocaleString()} new this month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" color="textSecondary">
                    Active Users
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {data.userMetrics.activeUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {((data.userMetrics.activeUsers / data.userMetrics.totalUsers) * 100).toFixed(1)}% of total users
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" color="textSecondary">
                    Subscribers
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    {data.subscriptionMetrics.totalSubscribers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {data.subscriptionMetrics.conversionRate}% conversion rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="div" color="textSecondary">
                    Avg. Revenue
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                    ${data.subscriptionMetrics.averageRevenue}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ${data.subscriptionMetrics.lifetimeValue} lifetime value
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row 1 */}
          <Grid container spacing={3} mb={4}>
            {/* User Growth */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  User Growth
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={data.monthlyUsers}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" name="Total Users" />
                    <Line type="monotone" dataKey="activeUsers" stroke="#82ca9d" name="Active Users" />
                    <Line type="monotone" dataKey="newUsers" stroke="#ffc658" name="New Users" />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Subscription Tiers */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Subscription Tiers
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.subscriptionTiers}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.subscriptionTiers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>

          {/* Charts Row 2 */}
          <Grid container spacing={3}>
            {/* Feature Usage */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Feature Usage
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.featureUsage}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            
            {/* Conversion Funnel */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Conversion Funnel
                </Typography>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.conversionFunnel}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* User Analytics Tab */}
      {tabValue === 1 && (
        <Typography variant="h6">User Analytics Content</Typography>
        // Additional user analytics charts would go here
      )}

      {/* Subscription Analytics Tab */}
      {tabValue === 2 && (
        <Typography variant="h6">Subscription Analytics Content</Typography>
        // Additional subscription analytics charts would go here
      )}

      {/* Feature Usage Tab */}
      {tabValue === 3 && (
        <Typography variant="h6">Feature Usage Content</Typography>
        // Additional feature usage charts would go here
      )}

      {/* Retention Tab */}
      {tabValue === 4 && (
        <>
          <Typography variant="h6" gutterBottom>User Retention by Cohort</Typography>
          <Paper sx={{ p: 2, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Cohort</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Day 1</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Day 7</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Day 30</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Day 60</th>
                  <th style={{ padding: '8px', textAlign: 'center' }}>Day 90</th>
                </tr>
              </thead>
              <tbody>
                {data.retentionData.map((row) => (
                  <tr key={row.cohort} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{row.cohort}</td>
                    <td style={{ padding: '8px', textAlign: 'center', backgroundColor: getRetentionColor(row.day1) }}>{row.day1}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', backgroundColor: getRetentionColor(row.day7) }}>{row.day7}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', backgroundColor: getRetentionColor(row.day30) }}>{row.day30}%</td>
                    <td style={{ padding: '8px', textAlign: 'center', backgroundColor: getRetentionColor(row.day60) }}>{row.day60 ? `${row.day60}%` : '-'}</td>
                    <td style={{ padding: '8px', textAlign: 'center', backgroundColor: getRetentionColor(row.day90) }}>{row.day90 ? `${row.day90}%` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </>
      )}
    </Container>
  );
};

// Helper function to get color based on retention percentage
const getRetentionColor = (value: number | null) => {
  if (value === null) return 'transparent';
  if (value >= 80) return 'rgba(0, 196, 159, 0.2)';
  if (value >= 60) return 'rgba(255, 187, 40, 0.2)';
  if (value >= 40) return 'rgba(255, 128, 66, 0.2)';
  return 'rgba(255, 99, 132, 0.2)';
};

export default CorpAstroDashboard;
