const categoriesService = require('../services/categories.service');

/**
 * Crear una nueva categoría
 * POST /categorias
 */
const create = async (req, res, next) => {
  try {
    const categoria = await categoriesService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: categoria
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las categorías
 * GET /categorias
 * Query params: page, limit, search
 */
const getAll = async (req, res, next) => {
  try {
    const result = await categoriesService.getAll(req.query);
    res.status(200).json({
      success: true,
      data: result.categorias,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener categoría por ID
 * GET /categorias/:id
 */
const getById = async (req, res, next) => {
  try {
    const categoria = await categoriesService.getById(req.params.id);
    res.status(200).json({
      success: true,
      data: categoria
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener categoría con sus recetas
 * GET /categorias/:id/recetas
 */
const getByIdWithRecipes = async (req, res, next) => {
  try {
    const categoria = await categoriesService.getByIdWithRecipes(req.params.id);
    res.status(200).json({
      success: true,
      data: categoria
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar categoría
 * PUT /categorias/:id
 */
const update = async (req, res, next) => {
  try {
    const categoria = await categoriesService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: categoria
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar categoría
 * DELETE /categorias/:id
 */
const deleteById = async (req, res, next) => {
  try {
    const result = await categoriesService.deleteById(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener estadísticas de categorías
 * GET /categorias/stats
 */
const getStats = async (req, res, next) => {
  try {
    const stats = await categoriesService.getStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByIdWithRecipes,
  update,
  deleteById,
  getStats
};
