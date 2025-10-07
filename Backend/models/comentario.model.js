module.exports = (sequelize, DataTypes) => {
  const Comentario = sequelize.define('Comentario', {
    id_comentario: {
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
    contenido: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El contenido es requerido'
        },
        len: {
          args: [1, 1000],
          msg: 'El contenido no puede exceder 1000 caracteres'
        }
      }
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'comentarios',
    timestamps: false
  });
  
  return Comentario;
};
