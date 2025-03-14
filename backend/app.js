const express = require('express');
const app = express();
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const dispositivoRoutes = require('./routes/dispositivoRoutes');
const programasRoutes = require('./routes/programasRoutes');
const historialDispositivosRoutes = require('./routes/historialDispositivosRoutes');
const historialCasosRoutes = require('./routes/historialCasosRoutes');
const alertasRoutes = require('./routes/alertasRoutes');
const historiasReportesRoutes = require('./routes/historiasReportesRoutes');
const rfidRoutes = require('./routes/rfidRoutes');
const carnetRoutes = require('./routes/carnetRoutes');
const observacionRoutes = require('./routes/observacionRoutes');

app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/dispositivos', dispositivoRoutes);
app.use('/api/programas', programasRoutes);
app.use('/api/historial-dispositivos', historialDispositivosRoutes);
app.use('/api/historial-casos', historialCasosRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/historias-reportes', historiasReportesRoutes);
app.use('/api/rfid', rfidRoutes);
app.use('/api/carnet', carnetRoutes);
app.use('/api/observacion', observacionRoutes);

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../')));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});