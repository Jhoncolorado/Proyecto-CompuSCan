const usuarioModel = require('../models/usuarioModel');
const dispositivoModel = require('../models/dispositivoModel');
const alertaModel = require('../models/alertaModel');
const historialDispositivoModel = require('../models/historialDispositivoModel');

const dashboardController = {
  getDashboardStats: async (req, res) => {
    try {
      const usuarios = await usuarioModel.countUsuarios();
      const dispositivos = await dispositivoModel.countDispositivos();
      // Estado de dispositivos (real)
      const aprobados = await dispositivoModel.countByEstado('aprobado');
      const pendientes = await dispositivoModel.countByEstado('pendiente');
      let estadoDispositivos = { aprobados, pendientes };
      // Actividad de hoy (real)
      const actividad = await historialDispositivoModel.countActividadHoy();
      // Actividad reciente (real)
      const actividadReciente = await historialDispositivoModel.getActividadReciente();
      res.json({ usuarios, dispositivos, estadoDispositivos, actividad, actividadReciente });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
    }
  },
  getDashboardStatsData: async () => {
    const usuarios = await usuarioModel.countUsuarios();
    const dispositivos = await dispositivoModel.countDispositivos();
    const aprobados = await dispositivoModel.countByEstado('aprobado');
    const pendientes = await dispositivoModel.countByEstado('pendiente');
    let estadoDispositivos = { aprobados, pendientes };
    const actividad = await historialDispositivoModel.countActividadHoy();
    const actividadReciente = await historialDispositivoModel.getActividadReciente();
    return { usuarios, dispositivos, estadoDispositivos, actividad, actividadReciente };
  }
};

module.exports = dashboardController; 