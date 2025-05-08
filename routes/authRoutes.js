const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
const { validateLogin } = require('../middleware/validate');
const logger = require('../config/logger');

router.post('/login', validateLogin, async (req, res) => {
  try {
    console.log('Recibida petición de login:', req.body);
    const { correo, contrasena } = req.body;
    
    console.log('Buscando usuario con correo:', correo);
    const usuario = await usuarioModel.getUsuarioByEmail(correo);
    
    if (!usuario) {
      console.log('Usuario no encontrado:', correo);
      logger.warn(`Intento de login fallido - Correo no encontrado: ${correo}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('Usuario encontrado, verificando contraseña');
    const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
    
    if (!isMatch) {
      console.log('Contraseña incorrecta para usuario:', usuario.id);
      logger.warn(`Intento de login fallido - Contraseña incorrecta para usuario: ${usuario.id}`);
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('Login exitoso, generando token');
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userResponse = {
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol
    };

    console.log('Enviando respuesta exitosa');
    logger.info(`Login exitoso para usuario: ${usuario.id}`);
    res.json({ token, usuario: userResponse });
  } catch (error) {
    console.error('Error en login:', error);
    logger.error(`Error en login: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;