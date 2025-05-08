const { body, validationResult } = require('express-validator');

// Validación para el login
exports.validateLogin = [
  body('correo')
    .isEmail()
    .withMessage('El correo electrónico no es válido')
    .notEmpty()
    .withMessage('El correo electrónico es requerido'),
  
  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  // Middleware para verificar si hay errores de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
]; 