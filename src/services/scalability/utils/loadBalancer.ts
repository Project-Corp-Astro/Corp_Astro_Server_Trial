// src/services/scalability/utils/loadBalancer.ts

import { Request, Response, NextFunction } from 'express';
import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';
import { SubscriptionTiers } from '../../../config/constants';

/**
 * Load balancing strategies
 */
export enum LoadBalancingStrategy {
  ROUND_ROBIN = 'round_robin',
  LEAST_CONNECTIONS = 'least_connections',
  RESPONSE_TIME = 'response_time',
  IP_HASH = 'ip_hash',
  TIER_BASED = 'tier_based',
}

/**
 * Load Balancer for distributing requests efficiently
 */
class LoadBalancer {
  private static instance: LoadBalancer;
  private strategy: LoadBalancingStrategy = LoadBalancingStrategy.TIER_BASED;
  private currentBackend: number = 0;
  private metrics = {
    totalRequests: 0,
    requestsPerBackend: {} as Record<string, number>,
    responseTimePerBackend: {} as Record<string, number>,
    connectionsPerBackend: {} as Record<string, number>,
  };

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of LoadBalancer
   */
  public static getInstance(): LoadBalancer {
    if (!LoadBalancer.instance) {
      LoadBalancer.instance = new LoadBalancer();
    }
    return LoadBalancer.instance;
  }

  /**
   * Initialize the load balancer
   */
  public initialize(): void {
    this.startMetricsCollection();
    logger.info(`Load balancer initialized with ${this.strategy} strategy`);
  }

  /**
   * Set the load balancing strategy
   * @param strategy Strategy to use
   */
  public setStrategy(strategy: LoadBalancingStrategy): void {
    this.strategy = strategy;
    logger.info(`Load balancing strategy set to ${strategy}`);
  }

  /**
   * Load balancing middleware
   */
  public balanceLoad(req: Request, res: Response, next: NextFunction): void {
    try {
      // Increment request counter
      this.metrics.totalRequests++;
      
      // Track response time
      const startTime = Date.now();
      
      // Add listener for response finish
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        // Store response time in Redis for monitoring
        redisClient.set(`stats:response:time:${req.path}`, responseTime.toString());
        
        // Calculate average response time
        redisClient.get('stats:response:time').then(avgTime => {
          const currentAvg = parseInt(avgTime || '0', 10);
          const newAvg = currentAvg === 0 ? 
            responseTime : 
            Math.round((currentAvg * 0.9) + (responseTime * 0.1)); // Weighted average
          
          redisClient.set('stats:response:time', newAvg.toString());
        });
      });
      
      // Apply load balancing strategy
      this.applyLoadBalancingStrategy(req);
      
      next();
    } catch (error) {
      logger.error('Error in load balancer:', error);
      next();
    }
  }

  /**
   * Apply the selected load balancing strategy
   * @param req Express request
   */
  private applyLoadBalancingStrategy(req: Request): void {
    switch (this.strategy) {
      case LoadBalancingStrategy.ROUND_ROBIN:
        this.applyRoundRobinStrategy();
        break;
      case LoadBalancingStrategy.LEAST_CONNECTIONS:
        this.applyLeastConnectionsStrategy();
        break;
      case LoadBalancingStrategy.RESPONSE_TIME:
        this.applyResponseTimeStrategy();
        break;
      case LoadBalancingStrategy.IP_HASH:
        this.applyIpHashStrategy(req);
        break;
      case LoadBalancingStrategy.TIER_BASED:
        this.applyTierBasedStrategy(req);
        break;
      default:
        this.applyRoundRobinStrategy();
    }
  }

  /**
   * Apply round-robin load balancing strategy
   */
  private applyRoundRobinStrategy(): void {
    // Simple round-robin implementation
    // In a real system, this would select from available backends
    this.currentBackend = (this.currentBackend + 1) % 4; // Assuming 4 backends
  }

  /**
   * Apply least connections load balancing strategy
   */
  private applyLeastConnectionsStrategy(): void {
    // Find backend with least active connections
    let minConnections = Number.MAX_SAFE_INTEGER;
    let selectedBackend = 0;
    
    for (let i = 0; i < 4; i++) { // Assuming 4 backends
      const connections = this.metrics.connectionsPerBackend[`backend-${i}`] || 0;
      
      if (connections < minConnections) {
        minConnections = connections;
        selectedBackend = i;
      }
    }
    
    this.currentBackend = selectedBackend;
  }

  /**
   * Apply response time load balancing strategy
   */
  private applyResponseTimeStrategy(): void {
    // Find backend with fastest response time
    let minResponseTime = Number.MAX_SAFE_INTEGER;
    let selectedBackend = 0;
    
    for (let i = 0; i < 4; i++) { // Assuming 4 backends
      const responseTime = this.metrics.responseTimePerBackend[`backend-${i}`] || 0;
      
      if (responseTime > 0 && responseTime < minResponseTime) {
        minResponseTime = responseTime;
        selectedBackend = i;
      }
    }
    
    this.currentBackend = selectedBackend;
  }

  /**
   * Apply IP hash load balancing strategy
   * @param req Express request
   */
  private applyIpHashStrategy(req: Request): void {
    // Hash the client IP to determine backend
    const ip = req.ip || '127.0.0.1';
    let hash = 0;
    
    for (let i = 0; i < ip.length; i++) {
      hash = ((hash << 5) - hash) + ip.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get backend index
    this.currentBackend = Math.abs(hash) % 4; // Assuming 4 backends
  }

  /**
   * Apply subscription tier-based load balancing strategy
   * @param req Express request
   */
  private applyTierBasedStrategy(req: Request): void {
    // Get user's subscription tier
    const tier = req.user?.subscription_tier || SubscriptionTiers.FREE;
    
    // Assign backends based on tier
    // Premium users get dedicated high-performance backends
    // Basic users get shared medium-performance backends
    // Free users get shared lower-performance backends
    switch (tier) {
      case SubscriptionTiers.PREMIUM:
        // Use backends 0-1 for premium users (highest performance)
        this.currentBackend = Math.floor(Math.random() * 2); // 0 or 1
        break;
      case SubscriptionTiers.BASIC:
        // Use backend 2 for basic users (medium performance)
        this.currentBackend = 2;
        break;
      default:
        // Use backend 3 for free users (standard performance)
        this.currentBackend = 3;
    }
    
    // Add X-Backend header for debugging
    req.headers['x-backend'] = `backend-${this.currentBackend}`;
  }

  /**
   * Start collecting load balancer metrics
   */
  private startMetricsCollection(): void {
    // Collect metrics every 30 seconds
    setInterval(() => {
      try {
        // In a real implementation, you would collect metrics from each backend
        
        // Log metrics periodically (every 5 minutes)
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() % fiveMinutes < 30000) {
          logger.info('Load balancer metrics:', {
            totalRequests: this.metrics.totalRequests,
            strategy: this.strategy,
            requestsPerBackend: this.metrics.requestsPerBackend,
          });
        }
        
        // Adapt strategy based on current conditions
        this.adaptStrategy();
      } catch (error) {
        logger.error('Error collecting load balancer metrics:', error);
      }
    }, 30000);
  }

  /**
   * Adapt load balancing strategy based on current conditions
   */
  private adaptStrategy(): void {
    try {
      // Get system health
      const systemHealth = global.systemHealth;
      
      if (!systemHealth) {
        return;
      }
      
      // Adapt strategy based on system health
      if (systemHealth.status === 'critical') {
        // During critical load, prioritize least connections to prevent overloading any single backend
        this.setStrategy(LoadBalancingStrategy.LEAST_CONNECTIONS);
      } else if (systemHealth.status === 'degraded') {
        // During degraded performance, prioritize response time to optimize user experience
        this.setStrategy(LoadBalancingStrategy.RESPONSE_TIME);
      } else {
        // During normal operation, use tier-based strategy for optimal resource allocation
        this.setStrategy(LoadBalancingStrategy.TIER_BASED);
      }
    } catch (error) {
      logger.error('Error adapting load balancing strategy:', error);
    }
  }

  /**
   * Get current load balancer metrics
   */
  public getLoadBalancerMetrics() {
    return { ...this.metrics };
  }
}

export default LoadBalancer.getInstance();
