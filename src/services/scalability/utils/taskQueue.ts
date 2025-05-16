// src/services/scalability/utils/taskQueue.ts

import { EventEmitter } from 'events';
import { redisClient } from '../../../config/redis.config';
import logger from '../../../utils/logger';
import { ScalabilityConfig } from '../config/scalabilityConfig';

// Define task types
export enum TaskType {
  CONTENT_GENERATION = 'content_generation',
  EMAIL_NOTIFICATION = 'email_notification',
  REPORT_GENERATION = 'report_generation',
  DATA_PROCESSING = 'data_processing',
  CACHE_WARMING = 'cache_warming',
  ANALYTICS_PROCESSING = 'analytics_processing',
}

// Define task priority levels
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

// Define task interface
export interface Task {
  id: string;
  type: TaskType;
  priority: TaskPriority;
  data: any;
  createdAt: number;
  attempts?: number;
  lastAttempt?: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
}

/**
 * Task Queue Manager for handling background processing
 */
class TaskQueue {
  private static instance: TaskQueue;
  private isProcessing: boolean = false;
  private taskHandlers: Map<TaskType, (task: Task) => Promise<void>> = new Map();
  private eventEmitter: EventEmitter = new EventEmitter();
  private metrics = {
    enqueued: 0,
    processed: 0,
    failed: 0,
    retried: 0,
    queueLength: 0,
    processingTime: 0,
  };

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of TaskQueue
   */
  public static getInstance(): TaskQueue {
    if (!TaskQueue.instance) {
      TaskQueue.instance = new TaskQueue();
    }
    return TaskQueue.instance;
  }

  /**
   * Initialize the task queue
   */
  public initialize(): void {
    this.startTaskProcessor();
    this.startMetricsCollection();
    logger.info('Task queue initialized');
  }

  /**
   * Register a task handler
   * @param taskType Type of task
   * @param handler Handler function
   */
  public registerTaskHandler(taskType: TaskType, handler: (task: Task) => Promise<void>): void {
    this.taskHandlers.set(taskType, handler);
    logger.info(`Registered handler for task type: ${taskType}`);
  }

  /**
   * Enqueue a task
   * @param task Task to enqueue
   */
  public async enqueueTask(task: Omit<Task, 'id' | 'createdAt' | 'attempts' | 'status'>): Promise<string> {
    try {
      const taskId = `task:${Date.now()}:${Math.random().toString(36).substring(2, 15)}`;
      
      const fullTask: Task = {
        id: taskId,
        ...task,
        createdAt: Date.now(),
        attempts: 0,
        status: 'pending',
      };
      
      // Store task in Redis
      await redisClient.set(`tasks:${taskId}`, JSON.stringify(fullTask));
      
      // Add to appropriate queue based on priority
      const queueKey = `queue:${task.priority}`;
      await redisClient.zAdd(queueKey, {
        score: Date.now(),
        value: taskId,
      });
      
      // Increment metrics
      this.metrics.enqueued++;
      await redisClient.incr('stats:tasks:enqueued');
      
      // Emit event
      this.eventEmitter.emit('task:enqueued', fullTask);
      
      logger.debug(`Enqueued task ${taskId} of type ${task.type} with ${task.priority} priority`);
      
      return taskId;
    } catch (error) {
      logger.error('Error enqueueing task:', error);
      throw error;
    }
  }

  /**
   * Start the task processor
   */
  private startTaskProcessor(): void {
    // Process tasks every second
    setInterval(async () => {
      if (this.isProcessing) {
        return;
      }
      
      try {
        this.isProcessing = true;
        
        // Process tasks in order of priority
        const priorities = [
          TaskPriority.CRITICAL,
          TaskPriority.HIGH,
          TaskPriority.MEDIUM,
          TaskPriority.LOW,
        ];
        
        for (const priority of priorities) {
          // Check system health before processing lower priority tasks
          if (
            (priority === TaskPriority.LOW || priority === TaskPriority.MEDIUM) &&
            global.systemHealth?.status === 'critical'
          ) {
            logger.warn(`Skipping ${priority} priority tasks due to critical system health`);
            continue;
          }
          
          // Get tasks from the queue (up to concurrency limit)
          const queueKey = `queue:${priority}`;
          const taskIds = await redisClient.zRange(queueKey, 0, ScalabilityConfig.QUEUE_CONCURRENCY - 1);
          
          if (taskIds.length === 0) {
            continue;
          }
          
          // Process tasks in parallel
          await Promise.all(
            taskIds.map(async (taskId) => {
              try {
                // Get task details
                const taskJson = await redisClient.get(`tasks:${taskId}`);
                
                if (!taskJson) {
                  // Task not found, remove from queue
                  await redisClient.zRem(queueKey, taskId);
                  return;
                }
                
                const task = JSON.parse(taskJson) as Task;
                
                // Update task status
                task.status = 'processing';
                task.attempts = (task.attempts || 0) + 1;
                task.lastAttempt = Date.now();
                
                await redisClient.set(`tasks:${taskId}`, JSON.stringify(task));
                
                // Remove from queue
                await redisClient.zRem(queueKey, taskId);
                
                // Process the task
                const handler = this.taskHandlers.get(task.type);
                
                if (!handler) {
                  logger.warn(`No handler registered for task type: ${task.type}`);
                  return;
                }
                
                const startTime = Date.now();
                
                try {
                  // Execute the task handler
                  await handler(task);
                  
                  // Update task status to completed
                  task.status = 'completed';
                  await redisClient.set(`tasks:${taskId}`, JSON.stringify(task));
                  
                  // Move to completed set
                  await redisClient.zAdd('tasks:completed', {
                    score: Date.now(),
                    value: taskId,
                  });
                  
                  // Update metrics
                  this.metrics.processed++;
                  await redisClient.incr('stats:tasks:processed');
                  this.metrics.processingTime += Date.now() - startTime;
                  
                  // Emit event
                  this.eventEmitter.emit('task:completed', task);
                  
                  logger.debug(`Completed task ${taskId} of type ${task.type}`);
                } catch (error) {
                  // Handle task failure
                  logger.error(`Error processing task ${taskId}:`, error);
                  
                  // Update metrics
                  this.metrics.failed++;
                  await redisClient.incr('stats:tasks:failed');
                  
                  // Check if we should retry
                  if ((task.attempts || 0) < ScalabilityConfig.QUEUE_RETRY_ATTEMPTS) {
                    // Re-queue with exponential backoff
                    const backoff = Math.pow(2, task.attempts || 0) * 1000; // 2^attempts seconds
                    
                    task.status = 'pending';
                    await redisClient.set(`tasks:${taskId}`, JSON.stringify(task));
                    
                    await redisClient.zAdd(queueKey, {
                      score: Date.now() + backoff,
                      value: taskId,
                    });
                    
                    // Update metrics
                    this.metrics.retried++;
                    await redisClient.incr('stats:tasks:retried');
                    
                    // Emit event
                    this.eventEmitter.emit('task:retried', task);
                    
                    logger.debug(`Retrying task ${taskId} after ${backoff}ms (attempt ${task.attempts})`);
                  } else {
                    // Mark as failed
                    task.status = 'failed';
                    await redisClient.set(`tasks:${taskId}`, JSON.stringify(task));
                    
                    // Move to failed set
                    await redisClient.zAdd('tasks:failed', {
                      score: Date.now(),
                      value: taskId,
                    });
                    
                    // Emit event
                    this.eventEmitter.emit('task:failed', task);
                    
                    logger.warn(`Task ${taskId} failed after ${task.attempts} attempts`);
                  }
                }
              } catch (error) {
                logger.error(`Error in task processor for ${taskId}:`, error);
              }
            })
          );
        }
      } catch (error) {
        logger.error('Error in task processor:', error);
      } finally {
        this.isProcessing = false;
      }
    }, 1000);
    
    // Clean up completed and failed tasks periodically
    setInterval(async () => {
      try {
        // Keep only the last 1000 completed tasks (for 24 hours)
        const completedCount = await redisClient.zCard('tasks:completed');
        if (completedCount > 1000) {
          await redisClient.zRemRangeByRank('tasks:completed', 0, completedCount - 1001);
        }
        
        // Keep failed tasks for 7 days
        const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        await redisClient.zRemRangeByScore('tasks:failed', 0, sevenDaysAgo);
      } catch (error) {
        logger.error('Error cleaning up task queue:', error);
      }
    }, 60 * 60 * 1000); // Every hour
  }

  /**
   * Start collecting task queue metrics
   */
  private startMetricsCollection(): void {
    // Collect metrics every 30 seconds
    setInterval(async () => {
      try {
        // Get queue lengths
        const [
          criticalLength,
          highLength,
          mediumLength,
          lowLength,
        ] = await Promise.all([
          redisClient.zCard('queue:critical'),
          redisClient.zCard('queue:high'),
          redisClient.zCard('queue:medium'),
          redisClient.zCard('queue:low'),
        ]);
        
        // Update queue length metric
        this.metrics.queueLength = criticalLength + highLength + mediumLength + lowLength;
        
        // Store in Redis for monitoring
        await redisClient.set('stats:queue:length', this.metrics.queueLength.toString());
        
        // Log metrics periodically (every 5 minutes)
        const fiveMinutes = 5 * 60 * 1000;
        if (Date.now() % fiveMinutes < 30000) {
          logger.info('Task queue metrics:', {
            queueLength: this.metrics.queueLength,
            processed: this.metrics.processed,
            failed: this.metrics.failed,
            retried: this.metrics.retried,
            avgProcessingTime: this.metrics.processed > 0 ? 
              `${(this.metrics.processingTime / this.metrics.processed).toFixed(2)}ms` : '0ms',
          });
        }
      } catch (error) {
        logger.error('Error collecting task queue metrics:', error);
      }
    }, 30000);
  }

  /**
   * Get current task queue metrics
   */
  public getQueueMetrics() {
    return { ...this.metrics };
  }

  /**
   * Get the event emitter for subscribing to task events
   */
  public getEventEmitter(): EventEmitter {
    return this.eventEmitter;
  }
}

export default TaskQueue.getInstance();
