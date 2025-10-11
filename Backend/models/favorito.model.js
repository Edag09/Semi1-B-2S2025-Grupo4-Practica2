module.exports = (sequelize, DataTypes) => {
  const Favorito = sequelize.define('Favorito', {
    id_favorito: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id_usuario'
      }
    },
    id_receta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'recetas',
        key: 'id_receta'
      }
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'favoritos',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['id_usuario', 'id_receta'],
        name: 'uq_usuario_receta'
      }
    ]
  });
  
  return Favorito;
};
