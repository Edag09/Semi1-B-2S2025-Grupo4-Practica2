const favoritesService = require('../services/favorites.service');

/**
 * Agregar receta a favoritos
 * POST /favoritos/:recetaId
 */
const addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const recetaId = req.params.recetaId;
    const result = await favoritesService.addFavorite(userId, recetaId);
    res.status(201).json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener favoritos del usuario
 * GET /favoritos
 */
const getFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const result = await favoritesService.getFavorites(userId, req.query);
    res.status(200).json({
      success: true,
      data: result.favoritos,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verificar si una receta está en favoritos
 * GET /favoritos/check/:recetaId
 */
const checkFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const recetaId = req.params.recetaId;
    const result = await favoritesService.checkFavorite(userId, recetaId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar de favoritos
 * DELETE /favoritos/:recetaId
 */
const removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const recetaId = req.params.recetaId;
    const result = await favoritesService.removeFavorite(userId, recetaId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener estadísticas de favoritos
 * GET /favoritos/stats
 */
const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const stats = await favoritesService.getStats(userId);
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  checkFavorite,
  removeFavorite,
  getStats
};
