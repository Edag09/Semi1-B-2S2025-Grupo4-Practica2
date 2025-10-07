const recipesService = require('../services/recipes.service');

/**
 * Crear una nueva receta
 * POST /recetas
 */
const create = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const receta = await recipesService.create(req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Receta creada exitosamente',
      data: receta
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las recetas
 * GET /recetas
 */
const getAll = async (req, res, next) => {
  try {
    const userId = req.user?.id_usuario || null;
    const result = await recipesService.getAll(req.query, userId);
    res.status(200).json({
      success: true,
      data: result.recetas,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener receta por ID
 * GET /recetas/:id
 */
const getById = async (req, res, next) => {
  try {
    const userId = req.user?.id_usuario || null;
    const receta = await recipesService.getById(req.params.id, userId);
    res.status(200).json({
      success: true,
      data: receta
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar receta
 * PUT /recetas/:id
 */
const update = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const receta = await recipesService.update(req.params.id, req.body, userId);
    res.status(200).json({
      success: true,
      message: 'Receta actualizada exitosamente',
      data: receta
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar receta
 * DELETE /recetas/:id
 */
const deleteById = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const result = await recipesService.deleteById(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener recetas populares
 * GET /recetas/popular
 */
const getPopular = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const recetas = await recipesService.getPopular(limit);
    res.status(200).json({
      success: true,
      data: recetas
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener mis recetas
 * GET /recetas/mis-recetas
 */
const getMyRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id_usuario;
    const result = await recipesService.getMyRecipes(userId, req.query);
    res.status(200).json({
      success: true,
      data: result.recetas,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
  getPopular,
  getMyRecipes
};
