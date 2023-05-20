const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'RetroGames Express API',
        version: '4.0.0',
        description: 'Aplicación REST API diseñada con Express.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
};

module.exports = { swaggerDefinition };
