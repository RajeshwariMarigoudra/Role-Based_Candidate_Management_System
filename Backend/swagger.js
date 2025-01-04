const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Authentication API',
      version: '1.0.0',
      description: 'API documentation for user authentication system',
    },
    servers: [
      {
        url: 'http://localhost:5000/', // Update this URL if your backend runs on a different port
      },
    ],
    components: {
      securitySchemes: {
        // Define the security scheme for JWT authentication
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [], // This tells Swagger that by default, all endpoints require a bearer token
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to your route files where API docs are defined
};

const specs = swaggerJSDoc(options);

module.exports = { swaggerUi, specs };
