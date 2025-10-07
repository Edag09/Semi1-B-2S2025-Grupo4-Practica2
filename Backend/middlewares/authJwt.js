const { verifyToken } = require('../utils/jwt');
const { Usuario } = require('../models');

/**
 * Middleware para verificar token JWT
 */
const verifyJWT = async (req, res, next) => {
  try {
    // Obtener token del header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    // Verificar formato "Bearer TOKEN"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido. Usar: Bearer <token>'
      });
    }

    const token = parts[1];

    // Verificar token
    const decoded = verifyToken(token);

    // Verificar que el usuario existe
    const user = await Usuario.findByPk(decoded.id_usuario);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Agregar usuario al request
    req.user = {
      id_usuario: user.id_usuario,
      username: user.username,
      email: user.email
    };

    next();
  } catch (error) {
    if (error.message === 'Token expirado') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado'
      });
    }
    if (error.message === 'Token inválido') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Error al verificar token',
      error: error.message
    });
  }
};

/**
 * Middleware opcional - no falla si no hay token
 */
const verifyJWTOptional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }

    const token = parts[1];
    const decoded = verifyToken(token);

    const user = await Usuario.findByPk(decoded.id_usuario);

    if (user) {
      req.user = {
        id_usuario: user.id_usuario,
        username: user.username,
        email: user.email
      };
    }

    next();
  } catch (error) {
    // Si hay error, continuar sin usuario autenticado
    next();
  }
};

module.exports = {
  verifyJWT,
  verifyJWTOptional
};
