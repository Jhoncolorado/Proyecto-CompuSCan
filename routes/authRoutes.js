const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const { validateLogin } = require('../middleware/validate');
const logger = require('../config/logger');

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    
    const usuario = await usuarioModel.getUsuarioByEmail(correo);
    if (!usuario) {
      logger.warn(`Intento de login fallido - Correo no encontrado: ${correo}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!isMatch) {
      logger.warn(`Intento de login fallido - Contraseña incorrecta para usuario: ${usuario.id}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`Login exitoso para usuario: ${usuario.id}`);
    res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    logger.error(`Error en login: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;