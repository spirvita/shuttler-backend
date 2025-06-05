const v1Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shuttler API Documentation',
      version: '1.0.0',
      description: 'API documentation for Shuttler backend services',
      contact: {
        name: 'API Repository',
        url: 'https://github.com/shuttler-tw/shuttler-backend',
      },
    },
    servers: [
      {
        url: process.env.API_URL ?? 'http://localhost:3002',
        description: 'Development server',
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*/*.js'], // Path to the API docs
};

module.exports = {
  v1Options,
};
