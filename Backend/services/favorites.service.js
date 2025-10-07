const favoritesRepo = require('../repositories/favorites.repo');
const recipesRepo = require('../repositories/recipes.repo');

/**
 * Agregar receta a favoritos
 */
const addFavorite = async (userId, recetaId) => {
  try {
    // Verificar que la receta existe
    const receta = await recipesRepo.findById(recetaId);
    if (!receta) {
      throw new Error('Receta no encontrada');
    }
    
    // Verificar si ya está en favoritos
    const yaExiste = await favoritesRepo.exists(userId, recetaId);
    if (yaExiste) {
      throw new Error('Esta receta ya está en tus favoritos');
    }
    
    // Agregar a favoritos
    const favorito = await favoritesRepo.create(userId, recetaId);
    
    return {
      message: 'Receta agregada a favoritos',
      data: favorito
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener favoritos del usuario
 */
const getFavorites = async (userId, query = {}) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const { count, rows } = await favoritesRepo.findByUser(userId, {
      limit,
      offset
    });
    
    return {
      favoritos: rows,
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
 * Verificar si una receta está en favoritos
 */
const checkFavorite = async (userId, recetaId) => {
  try {
    const exists = await favoritesRepo.exists(userId, recetaId);
    return { is_favorite: exists };
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar de favoritos
 */
const removeFavorite = async (userId, recetaId) => {
  try {
    const deleted = await favoritesRepo.deleteByUserAndRecipe(userId, recetaId);
    
    if (!deleted) {
      throw new Error('Esta receta no está en tus favoritos');
    }
    
    return { message: 'Receta eliminada de favoritos' };
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener estadísticas de favoritos del usuario
 */
const getStats = async (userId) => {
  try {
    const total = await favoritesRepo.countByUser(userId);
    return { total_favoritos: total };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  checkFavorite,
  removeFavorite,
  getStats
};
