// src/__tests__/setup.ts

import { redisClient } from '../config/redis.config';
import mongoose from 'mongoose';
import { sequelize } from '../config/sequelize.config';
import dotenv from 'dotenv';

// Load environment variables from .env.test file if it exists
dotenv.config({ path: '.env.test' });

// Global test setup
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = 'test';
  
  // Connect to test databases
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/corp-astro-test');
  }
  
  // Ensure Sequelize is connected to test database
  await sequelize.authenticate();
  
  // Clear Redis test database
  if (process.env.REDIS_TEST_DB) {
    await redisClient.select(parseInt(process.env.REDIS_TEST_DB, 10));
    await redisClient.flushDb();
  }
});

// Global test teardown
afterAll(async () => {
  // Disconnect from databases
  await mongoose.connection.close();
  await sequelize.close();
  await redisClient.quit();
});

// Reset database state between tests
afterEach(async () => {
  // Clear collections but don't drop the database
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
  
  // Clear Redis test database
  if (process.env.REDIS_TEST_DB) {
    await redisClient.flushDb();
  }
});
