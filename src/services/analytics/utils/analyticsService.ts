import { AnalyticsEvent, FeatureUsage, UserJourney } from '../models';
import { EventCategory, EventAction, createEvent } from './eventSchema';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../../../config/sequelize.config';
import { Op, fn, col } from 'sequelize';

// Queue for batch processing
let eventQueue: Record<string, any>[] = [];
const MAX_QUEUE_SIZE = 100;
const MAX_BATCH_INTERVAL = 30000; // 30 seconds
let batchTimeout: NodeJS.Timeout | null = null;

/**
 * Track an analytics event
 * @param eventName Name of the event
 * @param eventCategory Category of the event
 * @param eventAction Action performed
 * @param properties Additional event properties
 * @param userId User ID if available
 * @param sessionId Session ID
 * @param immediate Whether to save immediately or batch
 * @param timestamp Optional timestamp for the event (for mobile events that may be sent later)
 * @param deviceInfo Optional device information for mobile events
 */
export async function trackEvent(
  eventName: string,
  eventCategory: EventCategory,
  eventAction: EventAction,
  properties: Record<string, any> = {},
  userId?: string,
  sessionId: string = uuidv4(),
  immediate: boolean = false,
  timestamp?: Date,
  deviceInfo?: Record<string, any>
): Promise<string> {
  // Add device info to properties if provided
  if (deviceInfo) {
    properties.device_info = deviceInfo;
  }
  
  const event = createEvent(
    eventName,
    eventCategory,
    eventAction,
    properties,
    userId,
    sessionId
  );
  
  // Override timestamp if provided
  if (timestamp) {
    event.client_timestamp = timestamp;
  }
  
  const eventId = uuidv4();
  event.event_id = eventId;
  
  if (immediate) {
    // Convert event to proper AnalyticsEventCreationAttributes format
    const eventData = {
      event_id: event.event_id,
      session_id: event.session_id,
      event_name: event.event_name,
      event_category: event.event_category,
      event_action: event.event_action,
      client_timestamp: event.client_timestamp,
      user_id: event.user_id,
      properties: event.properties
    };
    await AnalyticsEvent.create(eventData);
  } else {
    // Add to batch queue
    eventQueue.push(event);
    
    // Process queue if it's full
    if (eventQueue.length >= MAX_QUEUE_SIZE) {
      await processBatchQueue();
    } else if (!batchTimeout) {
      // Start timeout to process queue if it's not processed within MAX_BATCH_INTERVAL
      batchTimeout = setTimeout(() => {
        processBatchQueue();
      }, MAX_BATCH_INTERVAL);
    }
  }
  
  return eventId;
}

/**
 * Process the batch queue of events
 */
export async function processBatchQueue(): Promise<void> {
  if (eventQueue.length === 0) return;
  
  if (batchTimeout) {
    clearTimeout(batchTimeout);
    batchTimeout = null;
  }
  
  const eventsToProcess = [...eventQueue];
  eventQueue = [];
  
  try {
    // Convert events to proper AnalyticsEventCreationAttributes format
    const formattedEvents = eventsToProcess.map(event => ({
      event_id: event.event_id,
      session_id: event.session_id,
      event_name: event.event_name,
      event_category: event.event_category,
      event_action: event.event_action,
      client_timestamp: event.client_timestamp,
      user_id: event.user_id,
      properties: event.properties
    }));
    // Use bulkCreate for efficiency
    await AnalyticsEvent.bulkCreate(formattedEvents);
  } catch (error) {
    console.error('Error processing analytics batch queue:', error);
    // Re-add failed events to the queue
    eventQueue = [...eventsToProcess, ...eventQueue];
  }
}

/**
 * Track feature usage
 * @param featureName Name of the feature
 * @param featureCategory Category of the feature
 * @param userId User ID if available
 * @param usageDuration Duration of usage in seconds
 * @param usageResult Result of the usage (success, failure, abandoned)
 * @param usageData Additional usage data
 */
export async function trackFeatureUsage(
  featureName: string,
  featureCategory: string,
  userId?: string,
  usageDuration?: number,
  usageResult?: 'success' | 'failure' | 'abandoned',
  usageData?: Record<string, any>
): Promise<void> {
  try {
    // Check if there's an existing record for this user and feature today
    if (userId) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingUsage = await FeatureUsage.findOne({
        where: {
          user_id: userId,
          feature_name: featureName,
          feature_category: featureCategory,
          last_used_at: {
            [Op.gte]: today
          }
        }
      });
      
      if (existingUsage) {
        // Update existing record
        await existingUsage.update({
          usage_count: existingUsage.usage_count + 1,
          last_used_at: new Date(),
          usage_duration: usageDuration,
          usage_result: usageResult,
          usage_data: usageData
        });
        return;
      }
    }
    
    // Create new record
    await FeatureUsage.create({
      user_id: userId,
      feature_name: featureName,
      feature_category: featureCategory,
      last_used_at: new Date(),
      usage_duration: usageDuration,
      usage_result: usageResult,
      usage_data: usageData
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
  }
}

/**
 * Start tracking a user journey
 * @param userId User ID
 * @param journeyName Name of the journey
 * @param totalSteps Total number of steps in the journey
 * @param journeyData Additional journey data
 */
export async function startUserJourney(
  userId: string,
  journeyName: string,
  totalSteps: number,
  journeyData?: Record<string, any>
): Promise<string> {
  try {
    // Check if there's an active journey of the same type
    const activeJourney = await UserJourney.findOne({
      where: {
        user_id: userId,
        journey_name: journeyName,
        completed: false
      }
    });
    
    if (activeJourney) {
      // Return existing journey ID
      return activeJourney.journey_id;
    }
    
    // Create new journey
    const journey = await UserJourney.create({
      user_id: userId,
      journey_name: journeyName,
      current_step: '1',
      total_steps: totalSteps,
      started_at: new Date(),
      journey_data: journeyData
    });
    
    return journey.journey_id;
  } catch (error) {
    console.error('Error starting user journey:', error);
    return '';
  }
}

/**
 * Update a user journey's progress
 * @param journeyId Journey ID
 * @param currentStep Current step
 * @param journeyData Updated journey data
 * @param completed Whether the journey is completed
 */
export async function updateUserJourney(
  journeyId: string,
  currentStep: string,
  journeyData?: Record<string, any>,
  completed: boolean = false
): Promise<boolean> {
  try {
    const journey = await UserJourney.findByPk(journeyId);
    
    if (!journey) {
      return false;
    }
    
    const updates: Record<string, any> = {
      current_step: currentStep,
      updated_at: new Date()
    };
    
    if (journeyData) {
      updates.journey_data = {
        ...journey.journey_data,
        ...journeyData
      };
    }
    
    if (completed) {
      updates.completed = true;
      updates.completed_at = new Date();
    }
    
    await journey.update(updates);
    return true;
  } catch (error) {
    console.error('Error updating user journey:', error);
    return false;
  }
}

/**
 * Get user journey analytics for a specific journey type
 * @param journeyName Name of the journey
 * @param startDate Start date for analysis
 * @param endDate End date for analysis
 */
export async function getJourneyAnalytics(
  journeyName: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  try {
    const journeys = await UserJourney.findAll({
      where: {
        journey_name: journeyName,
        started_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'current_step',
        'total_steps',
        'completed',
        [fn('COUNT', col('journey_id')), 'count']
      ],
      group: ['current_step', 'total_steps', 'completed']
    });
    
    // Calculate completion rate
    const totalJourneys = await UserJourney.count({
      where: {
        journey_name: journeyName,
        started_at: {
          [Op.between]: [startDate, endDate]
        }
      }
    });
    
    const completedJourneys = await UserJourney.count({
      where: {
        journey_name: journeyName,
        started_at: {
          [Op.between]: [startDate, endDate]
        },
        completed: true
      }
    });
    
    const completionRate = totalJourneys > 0 ? (completedJourneys / totalJourneys) * 100 : 0;
    
    // Calculate average time to complete
    const completedJourneysData = await UserJourney.findAll({
      where: {
        journey_name: journeyName,
        started_at: {
          [Op.between]: [startDate, endDate]
        },
        completed: true,
        // Use proper typing for the Op.not operator
        completed_at: {
          [Op.not]: null as any
        }
      },
      attributes: [
        'started_at',
        'completed_at'
      ]
    });
    
    let totalCompletionTime = 0;
    completedJourneysData.forEach(journey => {
      if (journey.completed_at && journey.started_at) {
        totalCompletionTime += journey.completed_at.getTime() - journey.started_at.getTime();
      }
    });
    
    const avgCompletionTimeMs = completedJourneysData.length > 0 ? totalCompletionTime / completedJourneysData.length : 0;
    const avgCompletionTimeMinutes = avgCompletionTimeMs / (1000 * 60);
    
    return {
      journeyName,
      totalJourneys,
      completedJourneys,
      completionRate,
      avgCompletionTimeMinutes,
      stepBreakdown: journeys
    };
  } catch (error) {
    console.error('Error getting journey analytics:', error);
    return {};
  }
}

/**
 * Get feature usage analytics
 * @param featureCategory Category of features to analyze
 * @param startDate Start date for analysis
 * @param endDate End date for analysis
 */
export async function getFeatureUsageAnalytics(
  featureCategory: string,
  startDate: Date,
  endDate: Date
): Promise<Record<string, any>> {
  try {
    const usageByFeature = await FeatureUsage.findAll({
      where: {
        feature_category: featureCategory,
        last_used_at: {
          [Op.between]: [startDate, endDate]
        }
      },
      attributes: [
        'feature_name',
        [fn('SUM', col('usage_count')), 'total_usage'],
        [fn('COUNT', fn('DISTINCT', col('user_id'))), 'unique_users']
      ],
      group: ['feature_name']
    });
    
    const usageByResult = await FeatureUsage.findAll({
      where: {
        feature_category: featureCategory,
        last_used_at: {
          [Op.between]: [startDate, endDate]
        },
        // Use proper typing for the Op.not operator
        usage_result: {
          [Op.not]: null as any
        }
      },
      attributes: [
        'feature_name',
        'usage_result',
        [fn('COUNT', col('usage_id')), 'count']
      ],
      group: ['feature_name', 'usage_result']
    });
    
    return {
      featureCategory,
      usageByFeature,
      usageByResult
    };
  } catch (error) {
    console.error('Error getting feature usage analytics:', error);
    return {};
  }
}

/**
 * Process a batch of events from mobile devices
 * @param events Array of events to process
 * @returns Number of events successfully processed
 */
export async function batchProcessEvents(events: Record<string, any>[]): Promise<number> {
  if (!events || events.length === 0) return 0;
  
  try {
    // Format events for database storage
    const formattedEvents = events.map(event => {
      // Ensure each event has an ID
      const eventId = event.event_id || uuidv4();
      
      return {
        event_id: eventId,
        session_id: event.session_id || uuidv4(),
        event_name: event.event_name,
        event_category: event.event_category,
        event_action: event.event_action,
        client_timestamp: event.client_timestamp || new Date(),
        user_id: event.user_id,
        properties: {
          ...event.properties,
          device_info: event.device_info || {}
        }
      };
    });
    
    // Use bulkCreate for efficiency
    await AnalyticsEvent.bulkCreate(formattedEvents);
    return formattedEvents.length;
  } catch (error) {
    console.error('Error processing mobile analytics batch:', error);
    return 0;
  }
}

// Export a function to ensure the batch queue is processed before the application shuts down
export async function flushAnalyticsQueue(): Promise<void> {
  await processBatchQueue();
}
