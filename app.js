// Cargar variables de entorno
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const dashboardController = require('./controllers/dashboardController');
const http = require('http');
const { Server } = require('socket.io');
const io = new Server(http.createServer(app), {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

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

// Configurar CORS - permitir todos los orígenes
app.use(cors({
  origin: true, // Permitir cualquier origen
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Middleware para procesar JSON y formularios
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware para añadir encabezados CORS a todas las respuestas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  
  next();
});

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
app.use('/api/dashboard/stats', dashboardController.getDashboardStats);

// Ruta de prueba para verificar CORS
app.get('/api/test-cors', (req, res) => {
  res.json({ message: 'La configuración CORS está funcionando correctamente' });
});

// Exponer la carpeta uploads para servir imágenes subidas por usuarios
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ruta para el frontend - enviar index.html
app.get('/', (req, res) => {
  console.log('Sirviendo index.html desde:', indexPath);
  res.sendFile(indexPath);
});

// Capturar todas las demás rutas para enviar al frontend
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/socket.io')) {
    // No loguear ni servir index.html para socket.io
    return next();
  }
  console.log('Ruta solicitada:', req.path);
  console.log('Sirviendo index.html para ruta desconocida');
  res.sendFile(indexPath);
});

// Ruta específica para CSS
app.use('/css', express.static(path.join(publicPath, 'css')));

// Ruta específica para imágenes
app.use('/images', express.static(path.join(publicPath, 'images')));

// Ruta específica para JavaScript
app.use('/js', express.static(path.join(publicPath, 'js')));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error en la aplicación:', err.stack);
  res.status(500).send('¡Algo salió mal!');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
http.createServer(app).listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación API disponible en http://localhost:${PORT}/api-docs`);
});

module.exports = { app, io };