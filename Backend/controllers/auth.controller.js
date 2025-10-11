const authService = require('../services/auth.service');

/**
 * Registrar un nuevo usuario
 * POST /auth/register
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Iniciar sesión
 * POST /auth/login
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener perfil del usuario autenticado
 * GET /auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const profile = await authService.getProfile(userId);
    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar perfil del usuario autenticado
 * PUT /auth/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const updatedProfile = await authService.updateProfile(userId, req.body);
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cambiar contraseña
 * PUT /auth/change-password
 */
const changePassword = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const result = await authService.changePassword(userId, req.body);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword
};
