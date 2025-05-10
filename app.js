// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Mostrar las variables de entorno cargadas (solo para desarrollo)
console.log('Variables de entorno:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('DB_NAME:', process.env.DB_NAME || 'compuscansecurity (valor por defecto)');

// Obtener la ruta absoluta al directorio actual
const rootDir = __dirname;
console.log('Directorio raíz de la aplicación:', rootDir);

// Obtener la ruta absoluta a la carpeta public
const publicPath = path.join(rootDir, 'public');
console.log('Ruta a public:', publicPath);

// Verificar si la carpeta public existe
const publicExists = fs.existsSync(publicPath);
console.log('¿Existe la carpeta public?', publicExists);

// Ruta completa al archivo index.html
const indexPath = path.join(publicPath, 'index.html');
console.log('Ruta a index.html:', indexPath);

// Verificar si el archivo index.html existe
const indexExists = fs.existsSync(indexPath);
console.log('¿Existe el archivo index.html?', indexExists);

// Middleware
app.use(cors({ 
  origin: true, // Permitir cualquier origen (modo desarrollo)
  credentials: true, // Permitir credenciales
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuración de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Documentación API Compuscan"
}));

// Rutas API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/dispositivos', require('./routes/dispositivoRoutes'));
app.use('/api/acceso', require('./routes/accesoRoutes'));
app.use('/api/alertas', require('./routes/alertaRoutes'));
app.use('/api/historiales', require('./routes/historialDispositivoRoutes'));
app.use('/api/programas', require('./routes/programaRoutes'));
app.use('/api/carnets', require('./routes/carnetRoutes'));
app.use('/api/casos', require('./routes/casoRoutes'));
app.use('/api/historial-alertas', require('./routes/historialAlertaRoutes'));

// Ruta de prueba para verificar CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ message: 'La configuración CORS está funcionando correctamente' });
});

// Servir archivos estáticos desde la carpeta public con una ruta absoluta
app.use(express.static(publicPath));

// Ruta específica para CSS
app.use('/css', express.static(path.join(publicPath, 'css')));

// Ruta específica para imágenes
app.use('/images', express.static(path.join(publicPath, 'images')));

// Ruta específica para JavaScript
app.use('/js', express.static(path.join(publicPath, 'js')));

// Ruta para el frontend - enviar index.html
app.get('/', (req, res) => {
  console.log('Sirviendo index.html desde:', indexPath);
  res.sendFile(indexPath);
});

// Capturar todas las demás rutas para enviar al frontend
app.get('*', (req, res) => {
  console.log('Ruta solicitada:', req.path);
  console.log('Sirviendo index.html para ruta desconocida');
  res.sendFile(indexPath);
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación API disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = app;