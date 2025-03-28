const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Middleware
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para el frontend - enviar index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación API disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = app;