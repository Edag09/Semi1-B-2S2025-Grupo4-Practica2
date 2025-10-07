const commentsRepo = require('../repositories/comments.repo');
const recipesRepo = require('../repositories/recipes.repo');

/**
 * Crear un nuevo comentario
 */
const create = async (recetaId, userId, contenido) => {
  try {
    // Validar contenido
    if (!contenido || contenido.trim() === '') {
      throw new Error('El contenido del comentario es requerido');
    }
    
    if (contenido.length > 1000) {
      throw new Error('El comentario no puede exceder 1000 caracteres');
    }
    
    // Verificar que la receta existe
    const receta = await recipesRepo.findById(recetaId);
    if (!receta) {
      throw new Error('Receta no encontrada');
    }
    
    // Crear comentario
    const nuevoComentario = await commentsRepo.create({
      id_usuario: userId,
      id_receta: recetaId,
      contenido: contenido.trim()
    });
    
    // Obtener comentario completo con relaciones
    const comentarioCompleto = await commentsRepo.findById(nuevoComentario.id_comentario);
    
    return comentarioCompleto;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener comentarios de una receta
 */
const getByRecipe = async (recetaId, query = {}) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 20;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await commentsRepo.findByRecipe(recetaId, {
      limit,
      offset
    });
    
    return {
      comentarios: rows,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener comentarios del usuario
 */
const getByUser = async (userId, query = {}) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await commentsRepo.findByUser(userId, {
      limit,
      offset
    });
    
    return {
      comentarios: rows,
      pagination: {
        total: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        perPage: limit
      }
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar comentario
 */
const update = async (id, userId, contenido) => {
  try {
    // Validar contenido
    if (!contenido || contenido.trim() === '') {
      throw new Error('El contenido del comentario es requerido');
    }
    
    if (contenido.length > 1000) {
      throw new Error('El comentario no puede exceder 1000 caracteres');
    }
    
    // Verificar que el comentario existe
    const comentario = await commentsRepo.findById(id);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }
    
    // Verificar que el usuario es el dueño
    if (comentario.id_usuario !== userId) {
      throw new Error('No tienes permiso para editar este comentario');
    }
    
    // Actualizar
    const comentarioActualizado = await commentsRepo.update(id, contenido.trim());
    
    // Obtener comentario completo
    const comentarioCompleto = await commentsRepo.findById(id);
    
    return comentarioCompleto;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar comentario
 */
const deleteById = async (id, userId) => {
  try {
    // Verificar que el comentario existe
    const comentario = await commentsRepo.findById(id);
    if (!comentario) {
      throw new Error('Comentario no encontrado');
    }
    
    // Verificar que el usuario es el dueño
    if (comentario.id_usuario !== userId) {
      throw new Error('No tienes permiso para eliminar este comentario');
    }
    
    const deleted = await commentsRepo.deleteById(id);
    
    if (!deleted) {
      throw new Error('Error al eliminar el comentario');
    }
    
    return { message: 'Comentario eliminado exitosamente' };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  getByRecipe,
  getByUser,
  update,
  deleteById
};
