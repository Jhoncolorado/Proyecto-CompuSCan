const express = require('express');
const app = express();
const path = require('path');
const usuarioRoutes = require('./routes/usuarioRoutes');
const dispositivoRoutes = require('./routes/dispositivoRoutes');
// Importa las demás rutas aquí

app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/dispositivos', dispositivoRoutes);
// Usa las demás rutas aquí

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../')));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});