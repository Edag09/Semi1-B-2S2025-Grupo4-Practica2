const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');
const { verifyJWT } = require('../middlewares/authJwt');

// Todas las rutas de favoritos requieren autenticación

/**
 * @route   GET /favoritos/stats
 * @desc    Obtener estadísticas de favoritos
 * @access  Private
 */
router.get('/stats', verifyJWT, favoritesController.getStats);

/**
 * @route   GET /favoritos/check/:recetaId
 * @desc    Verificar si una receta está en favoritos
 * @access  Private
 */
router.get('/check/:recetaId', verifyJWT, favoritesController.checkFavorite);

/**
 * @route   GET /favoritos
 * @desc    Obtener favoritos del usuario
 * @access  Private
 */
router.get('/mis-favoritas', verifyJWT, favoritesController.getFavorites);

/**
 * @route   POST /favoritos/:recetaId
 * @desc    Agregar receta a favoritos
 * @access  Private
 */
router.post('/add/:recetaId', verifyJWT, favoritesController.addFavorite);

/**
 * @route   DELETE /favoritos/:recetaId
 * @desc    Eliminar receta de favoritos
 * @access  Private
 */
router.delete('/remove/:recetaId', verifyJWT, favoritesController.removeFavorite);

module.exports = router;
