const historialesRouter = require('./routes/historiales');
const dispositivoRouter = require('./routes/dispositivo');

// Rutas
app.use('/api/historiales', historialesRouter);
app.use('/api/dispositivos', dispositivoRouter); 