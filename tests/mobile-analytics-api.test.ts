/**
 * Mobile Analytics API Test Script
 * Tests the mobile analytics API endpoints
 */

import axios from 'axios';

// Configuration
const API_BASE_URL = 'http://localhost:3000/api/mobile-analytics';
const TEST_USER_ID = 'test-user-123';
const TEST_SESSION_ID = 'test-session-456';

// Test device info
const deviceInfo = {
  device_model: 'iPhone 13',
  os_version: 'iOS 15.4',
  app_version: '1.2.3',
  screen_size: '390x844',
  locale: 'en_US',
  timezone: 'America/Los_Angeles',
  network_type: 'wifi'
};

// Helper function to make API requests
async function makeRequest(endpoint: string, data: any): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data);
    console.log(`✅ ${endpoint} - Success:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error(`❌ ${endpoint} - Error:`, error.response ? error.response.data : error.message);
    throw error;
  }
}

// Test batch event processing
async function testBatchEvents(): Promise<void> {
  console.log('\n🔍 Testing Batch Events API...');
  
  const events = [
    {
      event_name: 'app_opened',
      event_category: 'system',
      event_action: 'start',
      properties: {
        source: 'notification',
        time_of_day: 'morning'
      }
    },
    {
      event_name: 'chart_viewed',
      event_category: 'astrology',
      event_action: 'view',
      properties: {
        chart_type: 'natal',
        chart_id: 'chart-789'
      }
    }
  ];
  
  await makeRequest('/batch', {
    events,
    sessionId: TEST_SESSION_ID,
    deviceInfo
  });
}

// Test screen view tracking
async function testScreenView(): Promise<void> {
  console.log('\n🔍 Testing Screen View API...');
  
  await makeRequest('/screen-view', {
    screen_name: 'natal_chart_details',
    user_id: TEST_USER_ID,
    session_id: TEST_SESSION_ID,
    properties: {
      referrer: 'dashboard',
      chart_id: 'chart-789'
    },
    device_info: deviceInfo
  });
}

// Test A/B test variant retrieval
async function testGetTestVariant(): Promise<void> {
  console.log('\n🔍 Testing A/B Test Variant API...');
  
  await makeRequest('/ab-test/variant', {
    test_name: 'onboarding_flow',
    user_id: TEST_USER_ID,
    session_id: TEST_SESSION_ID
  });
}

// Test A/B test conversion tracking
async function testTestConversion(): Promise<void> {
  console.log('\n🔍 Testing A/B Test Conversion API...');
  
  await makeRequest('/ab-test/conversion', {
    test_name: 'onboarding_flow',
    user_id: TEST_USER_ID,
    session_id: TEST_SESSION_ID,
    conversion_value: 1
  });
}

// Test astrology feature tracking
async function testAstrologyFeature(): Promise<void> {
  console.log('\n🔍 Testing Astrology Feature API...');
  
  await makeRequest('/astrology-feature', {
    feature_type: 'chart_generation',
    user_id: TEST_USER_ID,
    session_id: TEST_SESSION_ID,
    properties: {
      chart_type: 'natal',
      birth_date: '1990-01-01',
      birth_location: 'New York, NY'
    },
    device_info: deviceInfo
  });
}

// Test engagement tracking
async function testEngagement(): Promise<void> {
  console.log('\n🔍 Testing Engagement API...');
  
  await makeRequest('/engagement', {
    engagement_type: 'chart_interaction',
    user_id: TEST_USER_ID,
    session_id: TEST_SESSION_ID,
    duration_seconds: 120,
    properties: {
      chart_id: 'chart-789',
      interaction_count: 5
    },
    device_info: deviceInfo
  });
}

// Test app lifecycle tracking
async function testAppLifecycle(): Promise<void> {
  console.log('\n🔍 Testing App Lifecycle API...');
  
  await makeRequest('/lifecycle', {
    lifecycle_event: 'app_start',
    user_id: TEST_USER_ID,
    session_id: TEST_SESSION_ID,
    properties: {
      startup_time_ms: 1200,
      is_cold_start: true
    },
    device_info: deviceInfo
  });
}

// Run all tests
async function runAllTests(): Promise<void> {
  console.log('🚀 Starting Mobile Analytics API Tests...');
  
  try {
    await testBatchEvents();
    await testScreenView();
    await testGetTestVariant();
    await testTestConversion();
    await testAstrologyFeature();
    await testEngagement();
    await testAppLifecycle();
    
    console.log('\n✅ All tests completed successfully!');
  } catch (error: any) {
    console.error('\n❌ Tests failed:', error.message);
  }
}

// Run the tests
runAllTests();
