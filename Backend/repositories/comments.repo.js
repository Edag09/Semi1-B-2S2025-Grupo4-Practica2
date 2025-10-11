const { Comentario, Usuario, Receta } = require('../models');

/**
 * Crear un nuevo comentario
 */
const create = async (comentarioData) => {
  return await Comentario.create(comentarioData);
};

/**
 * Obtener comentarios de una receta
 */
const findByRecipe = async (recetaId, options = {}) => {
  const { limit, offset } = options;
  
  return await Comentario.findAndCountAll({
    where: { id_receta: recetaId },
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'username', 'foto_url']
      }
    ],
    limit,
    offset,
    order: [['creado_en', 'DESC']],
    distinct: true
  });
};

/**
 * Obtener comentarios de un usuario
 */
const findByUser = async (userId, options = {}) => {
  const { limit, offset } = options;
  
  return await Comentario.findAndCountAll({
    where: { id_usuario: userId },
    include: [
      {
        model: Receta,
        as: 'receta',
        attributes: ['id_receta', 'titulo', 'foto_url']
      }
    ],
    limit,
    offset,
    order: [['creado_en', 'DESC']],
    distinct: true
  });
};

/**
 * Obtener comentario por ID
 */
const findById = async (id) => {
  return await Comentario.findByPk(id, {
    include: [
      {
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'username', 'foto_url']
      },
      {
        model: Receta,
        as: 'receta',
        attributes: ['id_receta', 'titulo']
      }
    ]
  });
};

/**
 * Actualizar comentario
 */
const update = async (id, contenido) => {
  const comentario = await Comentario.findByPk(id);
  if (!comentario) {
    return null;
  }
  return await comentario.update({ contenido });
};

/**
 * Eliminar comentario
 */
const deleteById = async (id) => {
  const comentario = await Comentario.findByPk(id);
  if (!comentario) {
    return false;
  }
  await comentario.destroy();
  return true;
};

/**
 * Contar comentarios de una receta
 */
const countByRecipe = async (recetaId) => {
  return await Comentario.count({
    where: { id_receta: recetaId }
  });
};

/**
 * Contar comentarios de un usuario
 */
const countByUser = async (userId) => {
  return await Comentario.count({
    where: { id_usuario: userId }
  });
};

module.exports = {
  create,
  findByRecipe,
  findByUser,
  findById,
  update,
  deleteById,
  countByRecipe,
  countByUser
};
