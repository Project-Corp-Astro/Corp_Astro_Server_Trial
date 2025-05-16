import { AnalyticsEvent } from '../models';
import { trackEvent } from './analyticsService';
import { EventCategory, EventAction } from './eventSchema';
import { sequelize, Op, safeLiteral, safeCol, safeFn } from './sequelizeHelpers';

interface HeatmapCoordinate {
  x: number;
  y: number;
  pageWidth: number;
  pageHeight: number;
  elementSelector?: string;
  elementId?: string;
  elementClass?: string;
}

interface HeatmapDataPoint {
  x: number;
  y: number;
  value: number;
  element?: string;
}

/**
 * Track a UI interaction for heatmap generation
 * @param pageUrl URL of the page where interaction occurred
 * @param coordinates Coordinates of the interaction
 * @param interactionType Type of interaction (click, hover, etc.)
 * @param userId User ID if available
 * @param sessionId Session ID
 */
export async function trackHeatmapInteraction(
  pageUrl: string,
  coordinates: HeatmapCoordinate,
  interactionType: 'click' | 'hover' | 'scroll' | 'dwell',
  userId?: string,
  sessionId?: string
): Promise<void> {
  try {
    // Normalize coordinates as percentages
    const normalizedX = Math.round((coordinates.x / coordinates.pageWidth) * 100);
    const normalizedY = Math.round((coordinates.y / coordinates.pageHeight) * 100);
    
    // Track as an analytics event
    await trackEvent(
      'ui_interaction',
      EventCategory.INTERACTION,
      interactionType === 'click' ? EventAction.CLICK : EventAction.VIEW,
      {
        page_url: pageUrl,
        x: normalizedX,
        y: normalizedY,
        x_raw: coordinates.x,
        y_raw: coordinates.y,
        page_width: coordinates.pageWidth,
        page_height: coordinates.pageHeight,
        element_selector: coordinates.elementSelector,
        element_id: coordinates.elementId,
        element_class: coordinates.elementClass,
        interaction_type: interactionType
      },
      userId,
      sessionId || 'anonymous'
    );
  } catch (error) {
    console.error('Error tracking heatmap interaction:', error);
  }
}

/**
 * Generate heatmap data for a specific page
 * @param pageUrl URL of the page to generate heatmap for
 * @param startDate Start date for data collection
 * @param endDate End date for data collection
 * @param interactionType Type of interaction to filter by
 * @param resolution Resolution of the heatmap grid (higher = more detailed)
 */
export async function generateHeatmapData(
  pageUrl: string,
  startDate: Date,
  endDate: Date,
  interactionType?: 'click' | 'hover' | 'scroll' | 'dwell',
  resolution: number = 50
): Promise<HeatmapDataPoint[]> {
  try {
    // Query for interactions on this page
    const whereClause: Record<string, any> = {
      event_name: 'ui_interaction',
      client_timestamp: {
        [Op.between]: [startDate, endDate]
      },
      'properties.page_url': pageUrl
    };
    
    if (interactionType) {
      whereClause['properties.interaction_type'] = interactionType;
    }
    
    const interactions = await AnalyticsEvent.findAll({
      where: whereClause,
      attributes: [
        [safeLiteral('properties->\'x\''), 'x'],
        [safeLiteral('properties->\'y\''), 'y'],
        [safeLiteral('properties->\'element_selector\''), 'element_selector'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [
        safeLiteral('properties->\'x\''),
        safeLiteral('properties->\'y\''),
        safeLiteral('properties->\'element_selector\'')
      ]
    });
    
    // Process the results
    const heatmapData: HeatmapDataPoint[] = interactions.map((interaction: any) => ({
      x: parseInt(interaction.get('x'), 10),
      y: parseInt(interaction.get('y'), 10),
      value: parseInt(interaction.get('count'), 10),
      element: interaction.get('element_selector')
    }));
    
    return heatmapData;
  } catch (error) {
    console.error('Error generating heatmap data:', error);
    return [];
  }
}

/**
 * Get the most interacted elements on a page
 * @param pageUrl URL of the page
 * @param startDate Start date for data collection
 * @param endDate End date for data collection
 * @param limit Maximum number of elements to return
 */
export async function getMostInteractedElements(
  pageUrl: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<Record<string, any>[]> {
  try {
    const elements = await AnalyticsEvent.findAll({
      where: {
        event_name: 'ui_interaction',
        client_timestamp: {
          [Op.between]: [startDate, endDate]
        },
        'properties.page_url': pageUrl,
        'properties.element_selector': {
          [Op.not]: null
        }
      },
      attributes: [
        [safeLiteral('properties->\'element_selector\''), 'element_selector'],
        [safeLiteral('properties->\'interaction_type\''), 'interaction_type'],
        [safeFn('COUNT', safeCol('event_id')), 'count']
      ],
      group: [
        safeLiteral('properties->\'element_selector\''),
        safeLiteral('properties->\'interaction_type\'')
      ],
      order: [[safeLiteral('count'), 'DESC']],
      limit
    });
    
    return elements.map((element: any) => ({
      element: element.get('element_selector'),
      interaction_type: element.get('interaction_type'),
      count: parseInt(element.get('count'), 10)
    }));
  } catch (error) {
    console.error('Error getting most interacted elements:', error);
    return [];
  }
}
