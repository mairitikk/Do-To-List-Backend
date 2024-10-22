const express = require('express');
const cors = require('cors');

// [Swagger] libreria swagger para generar API documentation
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Creación de instancia de express app
const app = express();

// Configuración express app
app.use(cors()); // Integración de CORS middleware
app.use(express.json()); // Parsear requests en formato JSON

// Ruta
app.use('/api', require('./routes/api'));

// [Swagger] documentacion de la API
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;