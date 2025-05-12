const usuarioModel = require('../models/usuarioModel');
const dispositivoModel = require('../models/dispositivoModel');
const alertaModel = require('../models/alertaModel');

const dashboardController = {
  getDashboardStats: async (req, res) => {
    try {
      const usuarios = await usuarioModel.countUsuarios();
      const dispositivos = await dispositivoModel.countDispositivos();
      res.json({ usuarios, dispositivos });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
    }
  }
};

module.exports = dashboardController; 