const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categories.controller');
const { verifyJWT } = require('../middlewares/authJwt');

/**
 * @route   GET /categorias/stats
 * @desc    Obtener estadísticas de categorías
 * @access  Public
 */
router.get('/stats', categoriesController.getStats);

/**
 * @route   POST /categorias
 * @desc    Crear una nueva categoría
 * @access  Private (requiere autenticación)
 */
router.post('/', verifyJWT, categoriesController.create);

/**
 * @route   GET /categorias
 * @desc    Obtener todas las categorías (con paginación)
 * @access  Public
 * @query   page, limit, search
 */
router.get('/', categoriesController.getAll);

/**
 * @route   GET /categorias/:id/recetas
 * @desc    Obtener categoría con sus recetas
 * @access  Public
 */
router.get('/:id/recetas', categoriesController.getByIdWithRecipes);

/**
 * @route   GET /categorias/:id
 * @desc    Obtener categoría por ID
 * @access  Public
 */
router.get('/:id', categoriesController.getById);

/**
 * @route   PUT /categorias/:id
 * @desc    Actualizar categoría
 * @access  Private (requiere autenticación)
 */
router.put('/:id', verifyJWT, categoriesController.update);

/**
 * @route   DELETE /categorias/:id
 * @desc    Eliminar categoría
 * @access  Private (requiere autenticación)
 */
router.delete('/:id', verifyJWT, categoriesController.deleteById);

module.exports = router;
