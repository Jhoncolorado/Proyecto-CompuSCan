const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Middleware
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Documentación API Compuscan"
}));

// Rutas API
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/dispositivos', require('./routes/dispositivoRoutes'));
app.use('/api/alertas', require('./routes/alertaRoutes'));
app.use('/api/historiales', require('./routes/historialDispositivoRoutes'));
app.use('/api/programas', require('./routes/programaRoutes'));
app.use('/api/carnets', require('./routes/carnetRoutes'));
app.use('/api/casos', require('./routes/casoRoutes'));
app.use('/api/historial-alertas', require('./routes/historialAlertaRoutes'));

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(path.join(__dirname, '..')));

// Ruta para el frontend - enviar index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});