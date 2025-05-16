import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Corp Astro Ecosystem API',
      version: '1.0.0',
      description: 'API Documentation for all services (user, astrology, subscription, etc.)',
    },
    servers: [
      {
        url: 'http://localhost:3000/api', // Base path for your APIs
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // JWT Authentication
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ], // This applies to all routes globally unless overridden
  },
  apis: ['./src/services/**/routes/*.ts' , 
    './src/services/**/swagger/*.ts',     // ✅ Swagger docs from all services
  ], // ✅ corrected path
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
