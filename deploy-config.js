/**
 * Deployment configuration for Corp Astro Server
 * This file defines deployment environments and settings
 */

module.exports = {
  // Production environment
  production: {
    host: process.env.PROD_HOST || 'api.corp-astro.com',
    port: process.env.PROD_PORT || 443,
    protocol: 'https',
    database: {
      host: process.env.PROD_DB_HOST,
      port: process.env.PROD_DB_PORT || 5432,
      name: process.env.PROD_DB_NAME || 'corp_astro_prod',
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      ssl: true
    },
    redis: {
      host: process.env.PROD_REDIS_HOST,
      port: process.env.PROD_REDIS_PORT || 6379,
      password: process.env.PROD_REDIS_PASSWORD
    },
    scaling: {
      minInstances: 2,
      maxInstances: 10,
      cpuThreshold: 70,
      memoryThreshold: 80
    },
    logging: {
      level: 'info',
      format: 'json',
      destination: 'cloudwatch'
    }
  },
  
  // Staging environment
  staging: {
    host: process.env.STAGING_HOST || 'staging-api.corp-astro.com',
    port: process.env.STAGING_PORT || 443,
    protocol: 'https',
    database: {
      host: process.env.STAGING_DB_HOST,
      port: process.env.STAGING_DB_PORT || 5432,
      name: process.env.STAGING_DB_NAME || 'corp_astro_staging',
      user: process.env.STAGING_DB_USER,
      password: process.env.STAGING_DB_PASSWORD,
      ssl: true
    },
    redis: {
      host: process.env.STAGING_REDIS_HOST,
      port: process.env.STAGING_REDIS_PORT || 6379,
      password: process.env.STAGING_REDIS_PASSWORD
    },
    scaling: {
      minInstances: 1,
      maxInstances: 3,
      cpuThreshold: 80,
      memoryThreshold: 85
    },
    logging: {
      level: 'debug',
      format: 'json',
      destination: 'cloudwatch'
    }
  },
  
  // Development environment
  development: {
    host: 'localhost',
    port: process.env.DEV_PORT || 3000,
    protocol: 'http',
    database: {
      host: process.env.DEV_DB_HOST || 'localhost',
      port: process.env.DEV_DB_PORT || 5432,
      name: process.env.DEV_DB_NAME || 'corp_astro_dev',
      user: process.env.DEV_DB_USER || 'postgres',
      password: process.env.DEV_DB_PASSWORD || 'postgres',
      ssl: false
    },
    redis: {
      host: process.env.DEV_REDIS_HOST || 'localhost',
      port: process.env.DEV_REDIS_PORT || 6379,
      password: process.env.DEV_REDIS_PASSWORD || ''
    },
    scaling: {
      minInstances: 1,
      maxInstances: 1
    },
    logging: {
      level: 'debug',
      format: 'pretty',
      destination: 'console'
    }
  },
  
  // Testing environment
  test: {
    host: 'localhost',
    port: process.env.TEST_PORT || 3001,
    protocol: 'http',
    database: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      name: process.env.TEST_DB_NAME || 'corp_astro_test',
      user: process.env.TEST_DB_USER || 'postgres',
      password: process.env.TEST_DB_PASSWORD || 'postgres',
      ssl: false
    },
    redis: {
      host: process.env.TEST_REDIS_HOST || 'localhost',
      port: process.env.TEST_REDIS_PORT || 6379,
      password: process.env.TEST_REDIS_PASSWORD || ''
    },
    logging: {
      level: 'error',
      format: 'pretty',
      destination: 'console'
    }
  }
};
