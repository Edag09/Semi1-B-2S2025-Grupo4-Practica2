module.exports = (sequelize, DataTypes) => {
  const RecetaCategoria = sequelize.define('RecetaCategoria', {
    id_receta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'recetas',
        key: 'id_receta'
      }
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'categorias',
        key: 'id_categoria'
      }
    }
  }, {
    tableName: 'receta_categorias',
    timestamps: false
  });
  
  return RecetaCategoria;
};
