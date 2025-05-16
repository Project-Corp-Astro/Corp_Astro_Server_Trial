// src/config/swagger.config.ts

import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

// Import schemas
import './swagger.schemas';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Corp Astro API',
      version: '1.0.0',
      description: 'API documentation for Corp Astro backend services',
      contact: {
        name: 'Corp Astro Support',
        url: 'https://corp-astro.com/support',
        email: 'support@corp-astro.com',
      },
      license: {
        name: 'Proprietary',
        url: 'https://corp-astro.com/terms',
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.corp-astro.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
              example: 'Detailed error information',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john.doe@example.com',
            },
            subscriptionTier: {
              type: 'string',
              enum: ['free', 'subscription', 'premium'],
              example: 'subscription',
            },
          },
        },
        DailyHoroscope: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Daily Horoscope for May 16, 2025',
            },
            content: {
              type: 'string',
              example: 'Today is a favorable day for business decisions...',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2025-05-16',
            },
            imageUrl: {
              type: 'string',
              example: 'https://assets.corp-astro.com/horoscopes/daily/2025-05-16.jpg',
            },
          },
        },
        MonthlyReport: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Monthly Business Report - May 2025',
            },
            content: {
              type: 'string',
              example: 'This month brings opportunities for expansion...',
            },
            month: {
              type: 'integer',
              example: 5,
            },
            year: {
              type: 'integer',
              example: 2025,
            },
            sections: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Financial Outlook',
                  },
                  content: {
                    type: 'string',
                    example: 'Financial matters look promising...',
                  },
                },
              },
            },
          },
        },
        BusinessInsight: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Business Astrological Analysis',
            },
            content: {
              type: 'string',
              example: 'Based on your business founding date...',
            },
            businessId: {
              type: 'string',
              example: 'business123',
            },
            insightType: {
              type: 'string',
              enum: ['weekly', 'monthly', 'quarterly', 'yearly'],
              example: 'monthly',
            },
            recommendations: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['Focus on partnerships this month', 'Delay major financial decisions until after the 15th'],
            },
          },
        },
        DeviceInfo: {
          type: 'object',
          properties: {
            deviceId: {
              type: 'string',
              example: 'device123',
            },
            platform: {
              type: 'string',
              enum: ['ios', 'android', 'web'],
              example: 'ios',
            },
            osVersion: {
              type: 'string',
              example: '15.0',
            },
            appVersion: {
              type: 'string',
              example: '1.2.3',
            },
            deviceModel: {
              type: 'string',
              example: 'iPhone 13',
            },
          },
        },
        BatchRequest: {
          type: 'object',
          properties: {
            requests: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  method: {
                    type: 'string',
                    enum: ['GET', 'POST', 'PUT', 'DELETE'],
                    example: 'GET',
                  },
                  path: {
                    type: 'string',
                    example: '/api/mobile/content/daily_horoscope',
                  },
                  headers: {
                    type: 'object',
                    example: {
                      'Content-Type': 'application/json',
                    },
                  },
                  query: {
                    type: 'object',
                    example: {
                      fields: 'title,content',
                    },
                  },
                  body: {
                    type: 'object',
                    example: {},
                  },
                },
                required: ['method', 'path'],
              },
            },
          },
          required: ['requests'],
        },
        SyncOperation: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'op123',
            },
            type: {
              type: 'string',
              enum: ['create', 'update', 'delete'],
              example: 'update',
            },
            resourceType: {
              type: 'string',
              example: 'users',
            },
            resourceId: {
              type: 'string',
              example: 'user123',
            },
            data: {
              type: 'object',
              example: {
                name: 'Updated Name',
              },
            },
            timestamp: {
              type: 'integer',
              example: 1621234567890,
            },
          },
          required: ['id', 'type', 'resourceType', 'resourceId', 'timestamp'],
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Unauthorized',
                error: 'Invalid or missing authentication token',
              },
            },
          },
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Forbidden',
                error: 'This feature requires a subscription',
              },
            },
          },
        },
        BadRequestError: {
          description: 'Invalid request parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Bad Request',
                error: 'Missing required parameters',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Server encountered an unexpected error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Internal Server Error',
                error: 'An unexpected error occurred',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'API endpoints for user authentication',
      },
      {
        name: 'Content',
        description: 'API endpoints for accessing astrological content',
      },
      {
        name: 'Mobile',
        description: 'Mobile-specific API endpoints and optimizations',
      },
      {
        name: 'Business',
        description: 'API endpoints for business astrology features',
      },
      {
        name: 'Free Tools',
        description: 'API endpoints for free astrological tools',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/services/*/routes/*.ts',
    './src/controllers/*.ts',
    './src/services/*/controllers/*.ts',
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
