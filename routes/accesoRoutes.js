const express = require('express');
const router = express.Router();

// Endpoint para acceso por RFID
router.get('/rfid/:rfid', async (req, res) => {
  try {
    const { rfid } = req.params;
    const dispositivo = await require('../models/dispositivoModel').getDispositivoByRFID(rfid);
    if (!dispositivo) {
      return res.status(404).json({ message: 'No se encontró un dispositivo con ese RFID' });
    }
    // Trae los datos del usuario asociado
    const usuario = await require('../models/usuarioModel').getUsuarioById(dispositivo.id_usuario);
    res.json({ usuario, dispositivo });
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar por RFID', error: error.message });
  }
});

module.exports = router; 