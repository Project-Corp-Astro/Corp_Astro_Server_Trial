// src/services/scalability/config/scalabilityConfig.ts

/**
 * Configuration for scalability settings
 */
export const ScalabilityConfig = {
  // Rate limiting settings
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100, // 100 requests per minute
  
  // Speed limiting settings
  SPEED_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  SPEED_LIMIT_DELAY_AFTER: 50, // Start delaying after 50 requests
  SPEED_LIMIT_DELAY_MS: 500, // Add 500ms delay per request over limit
  SPEED_LIMIT_MAX_DELAY_MS: 5000, // Maximum delay of 5 seconds
  
  // Connection pool settings
  DB_POOL_MIN: 5,
  DB_POOL_MAX: 20,
  DB_POOL_IDLE: 10000, // 10 seconds
  DB_POOL_ACQUIRE: 60000, // 60 seconds
  DB_POOL_MONITOR_INTERVAL: 30000, // 30 seconds
  DB_POOL_SCALE_THRESHOLD: 70, // Scale up when 70% of connections are used
  DB_POOL_SCALE_DOWN_THRESHOLD: 30, // Scale down when 30% of connections are used
  DB_POOL_ABSOLUTE_MAX: 50, // Never exceed 50 connections
  
  // Cluster settings
  WORKER_HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  WORKER_FORCE_KILL_TIMEOUT: 5000, // 5 seconds
  
  // Cache settings
  CACHE_DEFAULT_TTL: 300, // 5 minutes
  CACHE_CONTENT_TTL: 3600, // 1 hour
  CACHE_USER_TTL: 1800, // 30 minutes
  
  // Horizontal scaling settings
  CLUSTER_ENABLED: process.env.CLUSTER_ENABLED === 'true' || process.env.NODE_ENV === 'production',
  CLUSTER_WORKERS: process.env.CLUSTER_WORKERS ? 
    parseInt(process.env.CLUSTER_WORKERS, 10) : 
    Math.max(2, require('os').cpus().length),
  
  // Health check settings
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  
  // Circuit breaker settings
  CIRCUIT_BREAKER_THRESHOLD: 50, // 50% error rate
  CIRCUIT_BREAKER_RESET_TIMEOUT: 30000, // 30 seconds
  
  // Load shedding settings
  LOAD_SHEDDING_CPU_THRESHOLD: 80, // 80% CPU usage
  LOAD_SHEDDING_MEMORY_THRESHOLD: 85, // 85% memory usage
  
  // Request timeout settings
  REQUEST_TIMEOUT: 30000, // 30 seconds
  
  // Queue settings
  QUEUE_CONCURRENCY: 5,
  QUEUE_RETRY_ATTEMPTS: 3,
  
  // Batching settings
  BATCH_SIZE: 100,
  BATCH_WAIT_TIME: 1000, // 1 second
};

export default ScalabilityConfig;
