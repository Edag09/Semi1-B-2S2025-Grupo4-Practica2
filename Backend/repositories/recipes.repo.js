const { Receta, Usuario, Categoria, Comentario, Favorito, RecetaCategoria } = require('../models');
const { Op } = require('sequelize');

/**
 * Crear una nueva receta
 */
const create = async (recetaData) => {
  return await Receta.create(recetaData);
};

/**
 * Obtener todas las recetas con filtros
 */
const findAll = async (options = {}) => {
  const { limit, offset, search, visibilidad, id_usuario, id_categoria } = options;
  
  const where = {};
  const include = [
    {
      model: Usuario,
      as: 'usuario',
      attributes: ['id_usuario', 'username', 'foto_url']
    },
    {
      model: Categoria,
      as: 'categorias',
      attributes: ['id_categoria', 'nombre'],
      through: { attributes: [] }
    }
  ];
  
  // Filtro por búsqueda (título o descripción)
  if (search) {
    where[Op.or] = [
      { titulo: { [Op.like]: `%${search}%` } },
      { descripcion: { [Op.like]: `%${search}%` } }
    ];
  }
  
  // Filtro por visibilidad
  if (visibilidad) {
    where.visibilidad = visibilidad;
  }
  
  // Filtro por usuario
  if (id_usuario) {
    where.id_usuario = id_usuario;
  }
  
  // Filtro por categoría
  if (id_categoria) {
    include[1].where = { id_categoria };
    include[1].required = true;
  }
  
  return await Receta.findAndCountAll({
    where,
    include,
    limit,
    offset,
    order: [['creado_en', 'DESC']],
    distinct: true
  });
};

/**
 * Obtener receta por ID
 */
const findById = async (id) => {
  return await Receta.findByPk(id, {
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'username', 'foto_url']
      },
      {
        model: Categoria,
        as: 'categorias',
        attributes: ['id_categoria', 'nombre'],
        through: { attributes: [] }
      },
      {
        model: Comentario,
        as: 'comentarios',
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'username', 'foto_url']
          }
        ],
        order: [['creado_en', 'DESC']]
      }
    ]
  });
};

/**
 * Actualizar receta
 */
const update = async (id, recetaData) => {
  const receta = await Receta.findByPk(id);
  if (!receta) {
    return null;
  }
  return await receta.update(recetaData);
};

/**
 * Eliminar receta
 */
const deleteById = async (id) => {
  const receta = await Receta.findByPk(id);
  if (!receta) {
    return false;
  }
  await receta.destroy();
  return true;
};

/**
 * Asignar categorías a una receta
 */
const assignCategories = async (recetaId, categoriaIds) => {
  const receta = await Receta.findByPk(recetaId);
  if (!receta) {
    return null;
  }
  
  // Eliminar categorías anteriores
  await RecetaCategoria.destroy({ where: { id_receta: recetaId } });
  
  // Asignar nuevas categorías
  if (categoriaIds && categoriaIds.length > 0) {
    const categorias = await Categoria.findAll({
      where: { id_categoria: categoriaIds }
    });
    await receta.setCategorias(categorias);
  }
  
  return receta;
};

/**
 * Contar recetas por usuario
 */
const countByUser = async (userId) => {
  return await Receta.count({ where: { id_usuario: userId } });
};

/**
 * Obtener recetas populares (más favoritos)
 */
const findPopular = async (limit = 10) => {
  return await Receta.findAll({
    attributes: [
      'id_receta',
      'titulo',
      'descripcion',
      'foto_url',
      'creado_en',
      [Receta.sequelize.fn('COUNT', Receta.sequelize.col('favoritos.id_favorito')), 'total_favoritos']
    ],
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'username', 'foto_url']
      },
      {
        model: Favorito,
        as: 'favoritos',
        attributes: []
      }
    ],
    where: { visibilidad: 'public' },
    group: ['Receta.id_receta'],
    order: [[Receta.sequelize.literal('total_favoritos'), 'DESC']],
    limit,
    subQuery: false
  });
};

module.exports = {
  create,
  findAll,
  findById,
  update,
  deleteById,
  assignCategories,
  countByUser,
  findPopular
};
