const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Compuscan',
    version: '1.0.0',
    description: 'Documentación de la API de Compuscan Security',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desarrollo',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Rutas donde buscar anotaciones de Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;