import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Paper,
  Divider,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
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
import { getSubscriptionFunnelMetrics, getSubscriptionRetentionMetrics } from '../utils/subscriptionAnalytics';
import { getAstrologyFeatureAnalytics } from '../utils/astrologyMetrics';

// Color palette for charts
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `analytics-tab-${index}`,
    'aria-controls': `analytics-tabpanel-${index}`,
  };
}

// Mock data for demonstration
const mockUserGrowthData = [
  { month: 'Jan', users: 120, activeUsers: 90, newUsers: 30 },
  { month: 'Feb', users: 150, activeUsers: 110, newUsers: 40 },
  { month: 'Mar', users: 200, activeUsers: 150, newUsers: 50 },
  { month: 'Apr', users: 250, activeUsers: 180, newUsers: 70 },
  { month: 'May', users: 300, activeUsers: 220, newUsers: 80 },
  { month: 'Jun', users: 350, activeUsers: 260, newUsers: 50 },
];

const mockSubscriptionData = [
  { name: 'Free', value: 65 },
  { name: 'Basic', value: 20 },
  { name: 'Pro', value: 10 },
  { name: 'Enterprise', value: 5 },
];

const mockFunnelData = [
  { name: 'Page Views', value: 1000 },
  { name: 'Tier Selection', value: 400 },
  { name: 'Payment Started', value: 200 },
  { name: 'Subscription Complete', value: 150 },
];

const mockRetentionData = [
  { cohort: 'Jan 2025', month1: 100, month2: 80, month3: 70, month4: 65, month5: 60, month6: 55 },
  { cohort: 'Feb 2025', month1: 100, month2: 85, month3: 75, month4: 70, month5: 65, subscribers: 120 },
  { cohort: 'Mar 2025', month1: 100, month2: 90, month3: 80, month4: 75, subscribers: 150 },
  { cohort: 'Apr 2025', month1: 100, month2: 85, month3: 75, subscribers: 180 },
  { cohort: 'May 2025', month1: 100, month2: 90, subscribers: 200 },
  { cohort: 'Jun 2025', month1: 100, subscribers: 220 },
];

const UserGrowthDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [userGrowthData, setUserGrowthData] = useState(mockUserGrowthData);
  const [subscriptionData, setSubscriptionData] = useState(mockSubscriptionData);
  const [funnelData, setFunnelData] = useState(mockFunnelData);
  const [retentionData, setRetentionData] = useState(mockRetentionData);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as string);
    
    // In a real implementation, this would trigger a data fetch with the new time range
    setLoading(true);
    setTimeout(() => {
      // Simulate data loading
      setLoading(false);
    }, 1000);
  };

  // In a real implementation, this would fetch data from your API
  useEffect(() => {
    // Fetch data based on selected time range
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real implementation, you would call your API here
      // const startDate = calculateStartDate(timeRange);
      // const endDate = new Date();
      // const data = await fetchAnalyticsData(startDate, endDate);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2">
            Corp Astro Analytics Dashboard
          </Typography>
          <FormControl variant="outlined" size="small" style={{ minWidth: 150 }}>
            <InputLabel id="time-range-label">Time Range</InputLabel>
            <Select
              labelId="time-range-label"
              value={timeRange}
              onChange={handleTimeRangeChange}
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
          aria-label="analytics dashboard tabs"
        >
          <Tab label="User Growth" {...a11yProps(0)} />
          <Tab label="Subscriptions" {...a11yProps(1)} />
          <Tab label="Conversion Funnel" {...a11yProps(2)} />
          <Tab label="Retention" {...a11yProps(3)} />
        </Tabs>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="400px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        User Growth Trends
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={userGrowthData}
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
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Key Metrics
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Total Users
                              </Typography>
                              <Typography variant="h4">
                                {userGrowthData[userGrowthData.length - 1].users}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Active Users
                              </Typography>
                              <Typography variant="h4">
                                {userGrowthData[userGrowthData.length - 1].activeUsers}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                New Users
                              </Typography>
                              <Typography variant="h4">
                                {userGrowthData[userGrowthData.length - 1].newUsers}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Growth Rate
                              </Typography>
                              <Typography variant="h4">
                                +{Math.round((userGrowthData[userGrowthData.length - 1].newUsers / userGrowthData[userGrowthData.length - 2].users) * 100)}%
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Subscription Distribution
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={subscriptionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {subscriptionData.map((entry, index) => (
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
                        Subscription Metrics
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Paid Subscribers
                              </Typography>
                              <Typography variant="h4">
                                {subscriptionData.reduce((acc, curr) => curr.name !== 'Free' ? acc + curr.value : acc, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Conversion Rate
                              </Typography>
                              <Typography variant="h4">
                                {Math.round((subscriptionData.reduce((acc, curr) => curr.name !== 'Free' ? acc + curr.value : acc, 0) / subscriptionData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Avg Revenue/User
                              </Typography>
                              <Typography variant="h4">
                                $12.50
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Monthly Revenue
                              </Typography>
                              <Typography variant="h4">
                                $4,375
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Subscription Conversion Funnel
                      </Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={funnelData}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="value" fill="#8884d8">
                            {funnelData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Conversion Rates Between Steps
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          {funnelData.slice(0, -1).map((step, index) => (
                            <Grid item xs={12} md={4} key={`conversion-${index}`}>
                              <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                                <Typography variant="body2" color="textSecondary">
                                  {step.name} → {funnelData[index + 1].name}
                                </Typography>
                                <Typography variant="h4">
                                  {Math.round((funnelData[index + 1].value / step.value) * 100)}%
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Cohort Retention Analysis
                      </Typography>
                      <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Cohort</th>
                              <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Users</th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Month 1</th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Month 2</th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Month 3</th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Month 4</th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Month 5</th>
                              <th style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Month 6</th>
                            </tr>
                          </thead>
                          <tbody>
                            {retentionData.map((row, index) => (
                              <tr key={`retention-${index}`}>
                                <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{row.cohort}</td>
                                <td style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>{row.subscribers || '-'}</td>
                                <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: getCellColor(row.month1) }}>{row.month1 || '-'}%</td>
                                <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: getCellColor(row.month2) }}>{row.month2 || '-'}%</td>
                                <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: getCellColor(row.month3) }}>{row.month3 || '-'}%</td>
                                <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: getCellColor(row.month4) }}>{row.month4 || '-'}%</td>
                                <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: getCellColor(row.month5) }}>{row.month5 || '-'}%</td>
                                <td style={{ padding: '8px', textAlign: 'center', borderBottom: '1px solid #ddd', backgroundColor: getCellColor(row.month6) }}>{row.month6 || '-'}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </>
        )}
      </Paper>
    </Box>
  );
};

// Helper function to get color for retention cells
function getCellColor(value: number | undefined): string {
  if (!value) return 'transparent';
  if (value >= 90) return 'rgba(130, 202, 157, 0.2)';
  if (value >= 70) return 'rgba(136, 132, 216, 0.2)';
  if (value >= 50) return 'rgba(255, 198, 88, 0.2)';
  return 'rgba(255, 128, 66, 0.2)';
}

export default UserGrowthDashboard;
