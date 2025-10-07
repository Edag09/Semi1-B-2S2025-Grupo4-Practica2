const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes.controller');
const { verifyJWT, verifyJWTOptional } = require('../middlewares/authJwt');

/**
 * @route   GET /recetas/popular
 * @desc    Obtener recetas populares
 * @access  Public
 */
router.get('/popular', recipesController.getPopular);

/**
 * @route   GET /recetas/mis-recetas
 * @desc    Obtener mis recetas (usuario autenticado)
 * @access  Private
 */
router.get('/mis-recetas', verifyJWT, recipesController.getMyRecipes);

/**
 * @route   POST /recetas
 * @desc    Crear una nueva receta
 * @access  Private
 */
router.post('/', verifyJWT, recipesController.create);

/**
 * @route   GET /recetas
 * @desc    Obtener todas las recetas públicas (con filtros)
 * @access  Public (opcional autenticación para ver privadas propias)
 */
router.get('/', verifyJWTOptional, recipesController.getAll);

/**
 * @route   GET /recetas/:id
 * @desc    Obtener receta por ID
 * @access  Public (privadas solo para el dueño)
 */
router.get('/:id', verifyJWTOptional, recipesController.getById);

/**
 * @route   PUT /recetas/:id
 * @desc    Actualizar receta
 * @access  Private (solo el dueño)
 */
router.put('/:id', verifyJWT, recipesController.update);

/**
 * @route   DELETE /recetas/:id
 * @desc    Eliminar receta
 * @access  Private (solo el dueño)
 */
router.delete('/:id', verifyJWT, recipesController.deleteById);

module.exports = router;
