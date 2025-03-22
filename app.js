const express = require('express');
const path = require('path');
const app = express();

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const dispositivoRoutes = require('./routes/dispositivoRoutes');
const alertaRoutes = require('./routes/alertaRoutes');
const historialDispositivoRoutes = require('./routes/historialDispositivoRoutes');
const rfidRoutes = require('./routes/rfidRoutes');
const observacionRoutes = require('./routes/observacionRoutes');

// Middleware para parsear JSON
app.use(express.json());

// Configurar rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/dispositivos', dispositivoRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/historial-dispositivos', historialDispositivoRoutes);
app.use('/api/rfid', rfidRoutes);
app.use('/api/observaciones', observacionRoutes);

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../')));

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});