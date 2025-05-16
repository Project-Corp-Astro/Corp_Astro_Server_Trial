import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Cell
} from 'recharts';
import { 
  Container, Grid, Paper, Typography, 
  FormControl, InputLabel, Select, MenuItem,
  Box, Card, CardContent, CardHeader, Divider
} from '@mui/material';

// Types
interface DashboardProps {
  apiBaseUrl: string;
  token?: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
}

// Components
const MetricCard: React.FC<MetricCardProps> = ({ title, value, subtitle, icon, color = '#3f51b5' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h6" component="div" color="textSecondary">
            {title}
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="textSecondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {icon && (
          <Box sx={{ 
            backgroundColor: `${color}20`, 
            borderRadius: '50%', 
            padding: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

// Main Dashboard Component
const AnalyticsDashboard: React.FC<DashboardProps> = ({ apiBaseUrl, token }) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Calculate date range
        const endDate = new Date();
        let startDate = new Date();
        
        switch (timeRange) {
          case '7d':
            startDate.setDate(endDate.getDate() - 7);
            break;
          case '30d':
            startDate.setDate(endDate.getDate() - 30);
            break;
          case '90d':
            startDate.setDate(endDate.getDate() - 90);
            break;
          default:
            startDate.setDate(endDate.getDate() - 30);
        }

        const response = await fetch(
          `${apiBaseUrl}/dashboard?start_date=${startDate.toISOString()}&end_date=${endDate.toISOString()}`,
          {
            headers: {
              'Authorization': token ? `Bearer ${token}` : '',
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [apiBaseUrl, timeRange, token]);

  // Loading state
  if (loading) {
    return <Typography>Loading dashboard data...</Typography>;
  }

  // Error state
  if (error) {
    return <Typography color="error">Error loading dashboard: {error}</Typography>;
  }

  // No data state
  if (!dashboardData) {
    return <Typography>No data available</Typography>;
  }

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Prepare data for charts
  const prepareEventData = () => {
    if (!dashboardData.top_events) return [];
    return dashboardData.top_events.map((event: any) => ({
      name: event.event_name,
      count: event.count
    }));
  };

  const prepareJourneyData = () => {
    if (!dashboardData.journey_completion_rates) return [];
    return dashboardData.journey_completion_rates.map((journey: any) => ({
      name: journey.journey_name,
      completed: journey.completed,
      incomplete: journey.total - journey.completed,
      completionRate: ((journey.completed / journey.total) * 100).toFixed(1)
    }));
  };

  const prepareFeatureData = () => {
    if (!dashboardData.top_features) return [];
    return dashboardData.top_features.map((feature: any) => ({
      name: feature.feature_name,
      usage: feature.total_usage
    }));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Analytics Dashboard
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

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Total Events" 
            value={dashboardData.metrics.total_events.toLocaleString()} 
            subtitle="Total tracked interactions"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Unique Users" 
            value={dashboardData.metrics.unique_users.toLocaleString()} 
            subtitle="Distinct users"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard 
            title="Unique Sessions" 
            value={dashboardData.metrics.unique_sessions.toLocaleString()} 
            subtitle="Total user sessions"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} mb={4}>
        {/* Top Events */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Top Events
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareEventData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Journey Completion */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Journey Completion Rates
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareJourneyData()}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} unit="%" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="completionRate" fill="#82ca9d" name="Completion Rate (%)" />
              </BarChart>
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
              Top Features
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareFeatureData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="usage"
                >
                  {prepareFeatureData().map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* A/B Tests */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 300 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Active A/B Tests
            </Typography>
            {dashboardData.active_tests && dashboardData.active_tests.length > 0 ? (
              <Box sx={{ overflowY: 'auto', height: '100%' }}>
                {dashboardData.active_tests.map((test: any) => (
                  <Card key={test.test_id} sx={{ mb: 2, boxShadow: 'none', border: '1px solid #eee' }}>
                    <CardContent>
                      <Typography variant="subtitle1">{test.test_name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Started: {new Date(test.start_date).toLocaleDateString()}
                      </Typography>
                      {test.end_date && (
                        <Typography variant="body2" color="textSecondary">
                          Ends: {new Date(test.end_date).toLocaleDateString()}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Box>
            ) : (
              <Box display="flex" alignItems="center" justifyContent="center" height="100%">
                <Typography variant="body1" color="textSecondary">
                  No active A/B tests
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AnalyticsDashboard;
