const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    logger.warn('Intento de acceso no autorizado - Token no proporcionado');
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // logger.info(`Usuario autenticado: ${decoded.id}`); // Evitar spam en consola
    next();
  } catch (err) {
    logger.warn(`Token inválido: ${token}`);
    res.status(401).json({ error: 'Token inválido' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      logger.warn(`Usuario ${req.user.id} intentó acceder a recurso no autorizado`);
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };