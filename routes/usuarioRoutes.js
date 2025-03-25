const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/', usuarioController.createUsuario);       // Crear usuario
router.get('/', usuarioController.getAllUsuarios);      // Listar usuarios
router.get('/:id', usuarioController.getUsuarioById);   // Obtener usuario por ID
router.put('/:id', usuarioController.updateUsuario);    // Actualizar usuario
router.delete('/:id', usuarioController.deleteUsuario); // Eliminar usuario

module.exports = router;