import React, { useState, useEffect } from 'react';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  Card,
  CardContent,
  Typography,
  Grid,
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
      id={`astrology-tabpanel-${index}`}
      aria-labelledby={`astrology-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `astrology-tab-${index}`,
    'aria-controls': `astrology-tabpanel-${index}`,
  };
}

// Mock data for demonstration
const mockChartData = [
  { name: 'Natal', count: 450, avg_time: 2.3 },
  { name: 'Transit', count: 320, avg_time: 1.8 },
  { name: 'Synastry', count: 180, avg_time: 3.1 },
  { name: 'Composite', count: 120, avg_time: 3.5 },
  { name: 'Progressed', count: 90, avg_time: 2.7 },
  { name: 'Dasha', count: 60, avg_time: 2.2 },
];

const mockHoroscopeData = [
  { name: 'Daily', count: 1200, users: 450 },
  { name: 'Weekly', count: 800, users: 380 },
  { name: 'Monthly', count: 350, users: 320 },
];

const mockForecastData = [
  { name: 'Financial', count: 280, period: 'Monthly' },
  { name: 'Strategic', count: 220, period: 'Monthly' },
  { name: 'Team', count: 180, period: 'Monthly' },
  { name: 'General', count: 320, period: 'Monthly' },
  { name: 'Financial', count: 120, period: 'Quarterly' },
  { name: 'Strategic', count: 180, period: 'Quarterly' },
  { name: 'Team', count: 90, period: 'Quarterly' },
  { name: 'General', count: 150, period: 'Quarterly' },
];

const mockFreeToolData = [
  { name: 'Name Analysis', count: 580, conversion: 12 },
  { name: 'Tagline Analysis', count: 420, conversion: 8 },
  { name: 'Color Analysis', count: 350, conversion: 15 },
  { name: 'Logo Analysis', count: 280, conversion: 10 },
];

const mockAIUsageData = [
  { month: 'Jan', sessions: 120, avg_messages: 8, satisfaction: 4.2 },
  { month: 'Feb', sessions: 180, avg_messages: 9, satisfaction: 4.3 },
  { month: 'Mar', sessions: 250, avg_messages: 10, satisfaction: 4.4 },
  { month: 'Apr', sessions: 320, avg_messages: 12, satisfaction: 4.5 },
  { month: 'May', sessions: 380, avg_messages: 11, satisfaction: 4.6 },
  { month: 'Jun', sessions: 420, avg_messages: 13, satisfaction: 4.7 },
];

const AstrologyFeaturesDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [chartData, setChartData] = useState(mockChartData);
  const [horoscopeData, setHoroscopeData] = useState(mockHoroscopeData);
  const [forecastData, setForecastData] = useState(mockForecastData);
  const [freeToolData, setFreeToolData] = useState(mockFreeToolData);
  const [aiUsageData, setAiUsageData] = useState(mockAIUsageData);

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
      // const data = await getAstrologyFeatureAnalytics(startDate, endDate);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="h2">
            Corp Astro Feature Analytics
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
          aria-label="astrology features dashboard tabs"
        >
          <Tab label="Charts" {...a11yProps(0)} />
          <Tab label="Horoscopes" {...a11yProps(1)} />
          <Tab label="Business Forecasts" {...a11yProps(2)} />
          <Tab label="Free Tools" {...a11yProps(3)} />
          <Tab label="Astro Ratan AI" {...a11yProps(4)} />
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
                        Chart Generation by Type
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="Number of Charts" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Chart Generation Metrics
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Total Charts
                              </Typography>
                              <Typography variant="h4">
                                {chartData.reduce((sum, item) => sum + item.count, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Avg. Generation Time
                              </Typography>
                              <Typography variant="h4">
                                {(chartData.reduce((sum, item) => sum + (item.avg_time * item.count), 0) / 
                                  chartData.reduce((sum, item) => sum + item.count, 0)).toFixed(1)}s
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Most Popular Chart
                              </Typography>
                              <Typography variant="h4">
                                {chartData.reduce((max, item) => max.count > item.count ? max : item, { name: '', count: 0 }).name}
                              </Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Average Generation Time by Chart Type
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={chartData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="avg_time" fill="#82ca9d" name="Average Time (seconds)" />
                        </BarChart>
                      </ResponsiveContainer>
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
                        Horoscope Views by Type
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={horoscopeData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="Total Views" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Unique Users by Horoscope Type
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={horoscopeData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="users" fill="#82ca9d" name="Unique Users" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Horoscope Engagement Metrics
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Total Views
                              </Typography>
                              <Typography variant="h4">
                                {horoscopeData.reduce((sum, item) => sum + item.count, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Unique Users
                              </Typography>
                              <Typography variant="h4">
                                {horoscopeData.reduce((sum, item) => sum + item.users, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Views Per User
                              </Typography>
                              <Typography variant="h4">
                                {(horoscopeData.reduce((sum, item) => sum + item.count, 0) / 
                                  horoscopeData.reduce((sum, item) => sum + item.users, 0)).toFixed(1)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={12} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Most Popular
                              </Typography>
                              <Typography variant="h4">
                                {horoscopeData.reduce((max, item) => max.count > item.count ? max : item, { name: '', count: 0 }).name}
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
                        Business Forecast Usage by Type and Period
                      </Typography>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                          data={forecastData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="Usage Count" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Business Forecast Metrics
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Total Forecasts
                              </Typography>
                              <Typography variant="h4">
                                {forecastData.reduce((sum, item) => sum + item.count, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Monthly Forecasts
                              </Typography>
                              <Typography variant="h4">
                                {forecastData.filter(item => item.period === 'Monthly').reduce((sum, item) => sum + item.count, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Quarterly Forecasts
                              </Typography>
                              <Typography variant="h4">
                                {forecastData.filter(item => item.period === 'Quarterly').reduce((sum, item) => sum + item.count, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Most Popular Type
                              </Typography>
                              <Typography variant="h4">
                                {forecastData.reduce((max, item) => max.count > item.count ? max : item, { name: '', count: 0 }).name}
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
            
            <TabPanel value={tabValue} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Free Tool Usage
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={freeToolData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8884d8" name="Usage Count" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Free Tool Conversion
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={freeToolData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="conversion"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {freeToolData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Free Tool Metrics
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Total Usage
                              </Typography>
                              <Typography variant="h4">
                                {freeToolData.reduce((sum, item) => sum + item.count, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Total Conversions
                              </Typography>
                              <Typography variant="h4">
                                {freeToolData.reduce((sum, item) => sum + item.conversion, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Conversion Rate
                              </Typography>
                              <Typography variant="h4">
                                {((freeToolData.reduce((sum, item) => sum + item.conversion, 0) / 
                                  freeToolData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Best Converting Tool
                              </Typography>
                              <Typography variant="h4">
                                {freeToolData.reduce((max, item) => (max.conversion / max.count) > (item.conversion / item.count) ? max : item, { name: '', count: 1, conversion: 0 }).name}
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
            
            <TabPanel value={tabValue} index={4}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Astro Ratan AI Chat Usage
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={aiUsageData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="sessions" stroke="#8884d8" name="Chat Sessions" />
                          <Line type="monotone" dataKey="avg_messages" stroke="#82ca9d" name="Avg Messages per Session" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        User Satisfaction
                      </Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                          data={aiUsageData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 5]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="satisfaction" stroke="#ffc658" name="Satisfaction Score (0-5)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Astro Ratan AI Metrics
                      </Typography>
                      <Box mt={2}>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Total Sessions
                              </Typography>
                              <Typography variant="h4">
                                {aiUsageData.reduce((sum, item) => sum + item.sessions, 0)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Avg Messages/Session
                              </Typography>
                              <Typography variant="h4">
                                {(aiUsageData.reduce((sum, item) => sum + item.avg_messages, 0) / aiUsageData.length).toFixed(1)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Avg Satisfaction
                              </Typography>
                              <Typography variant="h4">
                                {(aiUsageData.reduce((sum, item) => sum + item.satisfaction, 0) / aiUsageData.length).toFixed(1)}
                              </Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="body2" color="textSecondary">
                                Growth Rate
                              </Typography>
                              <Typography variant="h4">
                                +{Math.round(((aiUsageData[aiUsageData.length - 1].sessions - aiUsageData[0].sessions) / aiUsageData[0].sessions) * 100)}%
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
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AstrologyFeaturesDashboard;
