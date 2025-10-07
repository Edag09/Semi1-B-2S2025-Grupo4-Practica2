const categoriesRepo = require('../repositories/categories.repo');

/**
 * Crear una nueva categoría
 */
const create = async (categoriaData) => {
  try {
    const { nombre, descripcion } = categoriaData;
    
    // Validar campos requeridos
    if (!nombre || nombre.trim() === '') {
      throw new Error('El nombre de la categoría es requerido');
    }
    
    // Verificar si ya existe una categoría con ese nombre
    const existingCategoria = await categoriesRepo.findByName(nombre);
    if (existingCategoria) {
      throw new Error('Ya existe una categoría con ese nombre');
    }
    
    // Crear la categoría
    const nuevaCategoria = await categoriesRepo.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : null
    });
    
    return nuevaCategoria;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener todas las categorías con paginación
 */
const getAll = async (query = {}) => {
  try {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search || '';
    
    const offset = (page - 1) * limit;
    
    const { count, rows } = await categoriesRepo.findAll({
      limit,
      offset,
      search
    });
    
    return {
      categorias: rows,
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
 * Obtener categoría por ID
 */
const getById = async (id) => {
  try {
    const categoria = await categoriesRepo.findById(id);
    
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    return categoria;
  } catch (error) {
    throw error;
  }
};

/**
 * Obtener categoría por ID con sus recetas
 */
const getByIdWithRecipes = async (id) => {
  try {
    const categoria = await categoriesRepo.findByIdWithRecipes(id);
    
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    return categoria;
  } catch (error) {
    throw error;
  }
};

/**
 * Actualizar categoría
 */
const update = async (id, categoriaData) => {
  try {
    const { nombre, descripcion } = categoriaData;
    
    // Verificar que la categoría existe
    const categoria = await categoriesRepo.findById(id);
    if (!categoria) {
      throw new Error('Categoría no encontrada');
    }
    
    // Si se está actualizando el nombre, verificar que no exista otro con ese nombre
    if (nombre && nombre !== categoria.nombre) {
      const exists = await categoriesRepo.existsByName(nombre, id);
      if (exists) {
        throw new Error('Ya existe una categoría con ese nombre');
      }
    }
    
    // Preparar datos a actualizar
    const updateData = {};
    if (nombre !== undefined) updateData.nombre = nombre.trim();
    if (descripcion !== undefined) updateData.descripcion = descripcion ? descripcion.trim() : null;
    
    // Actualizar
    const categoriaActualizada = await categoriesRepo.update(id, updateData);
    
    return categoriaActualizada;
  } catch (error) {
    throw error;
  }
};

/**
 * Eliminar categoría
 */
const deleteById = async (id) => {
  try {
    const deleted = await categoriesRepo.deleteById(id);
    
    if (!deleted) {
      throw new Error('Categoría no encontrada');
    }
    
    return { message: 'Categoría eliminada exitosamente' };
  } catch (error) {
    // Si hay error de foreign key, dar mensaje más claro
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new Error('No se puede eliminar la categoría porque tiene recetas asociadas');
    }
    throw error;
  }
};

/**
 * Obtener estadísticas de categorías
 */
const getStats = async () => {
  try {
    const totalCategorias = await categoriesRepo.count();
    
    return {
      total_categorias: totalCategorias
    };
  } catch (error) {
    throw error;
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
