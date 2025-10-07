const { Categoria, Receta } = require('../models');
const { Op } = require('sequelize');

/**
 * Crear una nueva categoría
 */
const create = async (categoriaData) => {
  return await Categoria.create(categoriaData);
};

/**
 * Obtener todas las categorías
 */
const findAll = async (options = {}) => {
  const { limit, offset, search } = options;
  
  const where = {};
  
  // Búsqueda por nombre
  if (search) {
    where.nombre = { [Op.like]: `%${search}%` };
  }
  
  return await Categoria.findAndCountAll({
    where,
    limit,
    offset,
    order: [['nombre', 'ASC']],
    distinct: true
  });
};

/**
 * Obtener categoría por ID
 */
const findById = async (id) => {
  return await Categoria.findByPk(id);
};

/**
 * Obtener categoría por ID con sus recetas
 */
const findByIdWithRecipes = async (id) => {
  return await Categoria.findByPk(id, {
    include: [
      {
        model: Receta,
        as: 'recetas',
        attributes: ['id_receta', 'titulo', 'descripcion', 'foto_url', 'visibilidad', 'creado_en'],
        through: { attributes: [] } // Excluir campos de la tabla intermedia
      }
    ]
  });
};

/**
 * Obtener categoría por nombre
 */
const findByName = async (nombre) => {
  return await Categoria.findOne({
    where: { nombre }
  });
};

/**
 * Actualizar categoría
 */
const update = async (id, categoriaData) => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return null;
  }
  return await categoria.update(categoriaData);
};

/**
 * Eliminar categoría
 */
const deleteById = async (id) => {
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return false;
  }
  await categoria.destroy();
  return true;
};

/**
 * Contar total de categorías
 */
const count = async () => {
  return await Categoria.count();
};

/**
 * Verificar si existe una categoría por nombre
 */
const existsByName = async (nombre, excludeId = null) => {
  const where = { nombre };
  
  if (excludeId) {
    where.id_categoria = { [Op.ne]: excludeId };
  }
  
  const count = await Categoria.count({ where });
  return count > 0;
};

module.exports = {
  create,
  findAll,
  findById,
  findByIdWithRecipes,
  findByName,
  update,
  deleteById,
  count,
  existsByName
};
