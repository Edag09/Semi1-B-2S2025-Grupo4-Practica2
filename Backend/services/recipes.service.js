const recipesRepo = require('../repositories/recipes.repo');

/**
 * Crear una nueva receta
 */
const create = async (recetaData, userId) => {
  try {
    const { titulo, descripcion, cuerpo, foto_url, visibilidad, categorias } = recetaData;
    
    // Validar campos requeridos
    if (!titulo || titulo.trim() === '') {
      throw new Error('El título de la receta es requerido');
    }
    
    // Crear la receta
    const nuevaReceta = await recipesRepo.create({
      id_usuario: userId,
      titulo: titulo.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      cuerpo: cuerpo ? cuerpo.trim() : null,
      foto_url: foto_url || null,
      visibilidad: visibilidad || 'public'
    });
    
    // Asignar categorías si se proporcionaron
    if (categorias && Array.isArray(categorias) && categorias.length > 0) {
      await recipesRepo.assignCategories(nuevaReceta.id_receta, categorias);
    }
    
    // Obtener la receta completa con relaciones
    const recetaCompleta = await recipesRepo.findById(nuevaReceta.id_receta);
    
    return recetaCompleta;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener todas las recetas con filtros y paginación
 */
const getAll = async (query = {}, userId = null) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || '';
    const visibilidad = query.visibilidad || null;
    const id_categoria = query.categoria || null;
    const mi_recetas = query.mis_recetas === 'true';
    
    const offset = (page - 1) * limit;
    
    // Si se solicitan solo las recetas del usuario
    const id_usuario = mi_recetas ? userId : null;
    
    const { count, rows } = await recipesRepo.findAll({
      limit,
      offset,
      search,
      visibilidad: mi_recetas ? null : (visibilidad || 'public'), // Si son mis recetas, mostrar todas
      id_usuario,
      id_categoria
    });
    
    return {
      recetas: rows,
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
 * Obtener receta por ID
 */
const getById = async (id, userId = null) => {
  try {
    const receta = await recipesRepo.findById(id);
    
    if (!receta) {
      throw new Error('Receta no encontrada');
    }
    
    // Si la receta es privada, solo el dueño puede verla
    if (receta.visibilidad === 'private' && receta.id_usuario !== userId) {
      throw new Error('No tienes permiso para ver esta receta');
    }
    
    return receta;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar receta
 */
const update = async (id, recetaData, userId) => {
  try {
    // Verificar que la receta existe
    const receta = await recipesRepo.findById(id);
    if (!receta) {
      throw new Error('Receta no encontrada');
    }
    
    // Verificar que el usuario es el dueño
    if (receta.id_usuario !== userId) {
      throw new Error('No tienes permiso para editar esta receta');
    }
    
    const { titulo, descripcion, cuerpo, foto_url, visibilidad, categorias } = recetaData;
    
    // Preparar datos a actualizar
    const updateData = {};
    if (titulo !== undefined) updateData.titulo = titulo.trim();
    if (descripcion !== undefined) updateData.descripcion = descripcion ? descripcion.trim() : null;
    if (cuerpo !== undefined) updateData.cuerpo = cuerpo ? cuerpo.trim() : null;
    if (foto_url !== undefined) updateData.foto_url = foto_url || null;
    if (visibilidad !== undefined) updateData.visibilidad = visibilidad;
    
    // Actualizar receta
    await recipesRepo.update(id, updateData);
    
    // Actualizar categorías si se proporcionaron
    if (categorias !== undefined && Array.isArray(categorias)) {
      await recipesRepo.assignCategories(id, categorias);
    }
    
    // Obtener receta actualizada
    const recetaActualizada = await recipesRepo.findById(id);
    
    return recetaActualizada;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar receta
 */
const deleteById = async (id, userId) => {
  try {
    // Verificar que la receta existe
    const receta = await recipesRepo.findById(id);
    if (!receta) {
      throw new Error('Receta no encontrada');
    }
    
    // Verificar que el usuario es el dueño
    if (receta.id_usuario !== userId) {
      throw new Error('No tienes permiso para eliminar esta receta');
    }
    
    const deleted = await recipesRepo.deleteById(id);
    
    if (!deleted) {
      throw new Error('Error al eliminar la receta');
    }
    
    return { message: 'Receta eliminada exitosamente' };
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener recetas populares
 */
const getPopular = async (limit = 10) => {
  try {
    const recetas = await recipesRepo.findPopular(limit);
    return recetas;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener mis recetas (del usuario autenticado)
 */
const getMyRecipes = async (userId, query = {}) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await recipesRepo.findAll({
      limit,
      offset,
      id_usuario: userId
    });
    
    return {
      recetas: rows,
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

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
  getPopular,
  getMyRecipes
};
