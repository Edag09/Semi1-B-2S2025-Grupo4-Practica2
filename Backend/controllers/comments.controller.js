const commentsService = require('../services/comments.service');

/**
 * POST /comentarios/:recetaId
 * Crear un comentario en una receta
 */
const create = async (req, res, next) => {
  try {
    const { recetaId } = req.params;
    const { contenido } = req.body;
    const userId = req.userId;
    
    const comentario = await commentsService.create(recetaId, userId, contenido);
    
    res.status(201).json({
      success: true,
      message: 'Comentario creado exitosamente',
      data: comentario
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /comentarios/receta/:recetaId
 * Obtener comentarios de una receta
 */
const getByRecipe = async (req, res, next) => {
  try {
    const { recetaId } = req.params;
    
    const result = await commentsService.getByRecipe(recetaId, req.query);
    
    res.json({
      success: true,
      data: result.comentarios,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /comentarios/mis-comentarios
 * Obtener comentarios del usuario autenticado
 */
const getMyComments = async (req, res, next) => {
  try {
    const userId = req.userId;
    
    const result = await commentsService.getByUser(userId, req.query);
    
    res.json({
      success: true,
      data: result.comentarios,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /comentarios/:id
 * Actualizar un comentario
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { contenido } = req.body;
    const userId = req.userId;
    
    const comentario = await commentsService.update(id, userId, contenido);
    
    res.json({
      success: true,
      message: 'Comentario actualizado exitosamente',
      data: comentario
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /comentarios/:id
 * Eliminar un comentario
 */
const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const result = await commentsService.deleteById(id, userId);
    
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getByRecipe,
  getMyComments,
  update,
  deleteById
};
