/**
 * Test setup file for Corp Astro Server
 * This file configures the test environment for Jest
 */

import { sequelize } from '../services/analytics/utils/sequelizeHelpers';

// Mock Sequelize
jest.mock('../services/analytics/utils/sequelizeHelpers', () => ({
  sequelize: {
    define: jest.fn(),
    sync: jest.fn().mockResolvedValue(true),
    authenticate: jest.fn().mockResolvedValue(true),
    transaction: jest.fn().mockImplementation((callback) => {
      return callback({ commit: jest.fn(), rollback: jest.fn() });
    }),
  },
  Op: {
    between: 'between',
    gte: 'gte',
    lte: 'lte',
    not: 'not',
    or: 'or',
    and: 'and',
    like: 'like',
    in: 'in',
  },
  safeLiteral: jest.fn().mockImplementation((str) => str),
  safeCol: jest.fn().mockImplementation((str) => str),
  safeFn: jest.fn().mockImplementation((fn, arg) => `${fn}(${arg})`),
}));

// Mock AnalyticsEvent model
jest.mock('../services/analytics/models', () => {
  const mockModel = {
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ event_id: 'test-event-id' }),
    update: jest.fn().mockResolvedValue([1]),
    destroy: jest.fn().mockResolvedValue(1),
    count: jest.fn().mockResolvedValue(0),
  };

  return {
    AnalyticsEvent: mockModel,
    ABTest: { ...mockModel },
    ABTestAssignment: { ...mockModel },
    FeatureUsage: { ...mockModel },
    UserJourney: { ...mockModel },
  };
});

// Global beforeAll hook
beforeAll(() => {
  // Add any global setup here
  console.log('Setting up test environment...');
});

// Global afterAll hook
afterAll(() => {
  // Add any global teardown here
  console.log('Tearing down test environment...');
});

// Global beforeEach hook
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
