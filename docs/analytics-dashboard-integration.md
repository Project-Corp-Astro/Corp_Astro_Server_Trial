# Analytics Dashboard Integration Guide

This guide explains how to integrate the Corp Astro Analytics Dashboard into your application.

## Prerequisites

The dashboard component requires the following dependencies:

```bash
npm install --save react react-dom @types/react @types/react-dom recharts @mui/material @emotion/react @emotion/styled
```

## TypeScript Configuration

Ensure your `tsconfig.json` includes JSX support:

```json
{
  "compilerOptions": {
    // Other options...
    "jsx": "react",
    "lib": ["dom", "dom.iterable", "esnext"],
    "moduleResolution": "node"
  }
}
```

## Basic Integration

### 1. Import the Dashboard Component

```tsx
import AnalyticsDashboard from '../services/analytics/dashboard/DashboardTemplate';
```

### 2. Use the Dashboard in Your Admin Panel

```tsx
import React from 'react';
import AnalyticsDashboard from '../services/analytics/dashboard/DashboardTemplate';
import { Container, Typography } from '@mui/material';

// Your authentication token from your auth system
const authToken = 'your-auth-token';

function AdminAnalyticsPage() {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ my: 4 }}>
        Analytics Dashboard
      </Typography>
      
      <AnalyticsDashboard 
        apiBaseUrl="/api/analytics" 
        token={authToken} 
      />
    </Container>
  );
}

export default AdminAnalyticsPage;
```

## Custom Dashboard Integration

You can customize the dashboard by creating your own components based on the template:

### 1. Create a Custom Dashboard Component

```tsx
import React from 'react';
import AnalyticsDashboard from '../services/analytics/dashboard/DashboardTemplate';
import { Box, Typography, Paper } from '@mui/material';

function CustomAnalyticsDashboard({ apiBaseUrl, token }) {
  // Add your custom state and logic here
  
  return (
    <Box>
      {/* Your custom header or navigation */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5">Corp Astro Insights</Typography>
        <Typography variant="body2" color="text.secondary">
          Real-time analytics for your astrology business
        </Typography>
      </Paper>
      
      {/* Use the base dashboard */}
      <AnalyticsDashboard 
        apiBaseUrl={apiBaseUrl} 
        token={token} 
      />
      
      {/* Add your custom components below */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Custom Insights</Typography>
        {/* Your custom charts or analytics */}
      </Paper>
    </Box>
  );
}

export default CustomAnalyticsDashboard;
```

## Adding Custom Charts

You can extend the dashboard with custom charts using Recharts:

```tsx
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { Paper, Typography, Box } from '@mui/material';

// Sample data
const data = [
  { month: 'Jan', users: 400, revenue: 2400 },
  { month: 'Feb', users: 300, revenue: 1398 },
  { month: 'Mar', users: 200, revenue: 9800 },
  { month: 'Apr', users: 278, revenue: 3908 },
  { month: 'May', users: 189, revenue: 4800 },
  { month: 'Jun', users: 239, revenue: 3800 }
];

function RevenueChart() {
  return (
    <Paper sx={{ p: 2, height: 300, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Revenue
      </Typography>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
          <Line type="monotone" dataKey="users" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}

export default RevenueChart;
```

## Securing the Dashboard

Ensure your dashboard is only accessible to authorized users:

1. Create a protected route in your application
2. Implement authentication middleware for the analytics API endpoints
3. Pass the authentication token to the dashboard component

```tsx
// Example of a protected route
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function ProtectedAnalyticsDashboard() {
  const { user, isLoading, token } = useAuth();
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <AnalyticsDashboard 
      apiBaseUrl="/api/analytics" 
      token={token} 
    />
  );
}
```

## Troubleshooting

### Common Issues

1. **JSX errors**: Ensure your tsconfig.json has `"jsx": "react"` in the compiler options.

2. **Missing dependencies**: Make sure all required packages are installed:
   ```bash
   npm install --save react react-dom @types/react @types/react-dom recharts @mui/material @emotion/react @emotion/styled
   ```

3. **API connection issues**: Check that your API endpoints match the ones expected by the dashboard.

4. **Authentication errors**: Verify that your token is being passed correctly and that it's valid.

### Performance Optimization

For large datasets, consider implementing:

1. Data pagination
2. Lazy loading of charts
3. Caching of analytics results
4. Server-side aggregation of data

## Next Steps

1. Customize the dashboard to match your application's design system
2. Add additional charts specific to your business metrics
3. Implement real-time updates using WebSockets
4. Create downloadable reports from the dashboard data
