const { Favorito, Receta, Usuario } = require('../models');

/**
 * Agregar receta a favoritos
 */
const create = async (userId, recetaId) => {
  return await Favorito.create({
    id_usuario: userId,
    id_receta: recetaId
  });
};

/**
 * Obtener favoritos de un usuario
 */
const findByUser = async (userId, options = {}) => {
  const { limit, offset } = options;
  
  return await Favorito.findAndCountAll({
    where: { id_usuario: userId },
    include: [
      {
        model: Receta,
        as: 'receta',
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'username', 'foto_url']
          }
        ]
      }
    ],
    limit,
    offset,
    order: [['creado_en', 'DESC']],
    distinct: true
  });
};

/**
 * Verificar si una receta está en favoritos
 */
const exists = async (userId, recetaId) => {
  const count = await Favorito.count({
    where: {
      id_usuario: userId,
      id_receta: recetaId
    }
  });
  return count > 0;
};

/**
 * Eliminar de favoritos
 */
const deleteByUserAndRecipe = async (userId, recetaId) => {
  const deleted = await Favorito.destroy({
    where: {
      id_usuario: userId,
      id_receta: recetaId
    }
  });
  return deleted > 0;
};

/**
 * Contar favoritos de un usuario
 */
const countByUser = async (userId) => {
  return await Favorito.count({
    where: { id_usuario: userId }
  });
};

/**
 * Contar favoritos de una receta
 */
const countByRecipe = async (recetaId) => {
  return await Favorito.count({
    where: { id_receta: recetaId }
  });
};

module.exports = {
  create,
  findByUser,
  exists,
  deleteByUserAndRecipe,
  countByUser,
  countByRecipe
};
