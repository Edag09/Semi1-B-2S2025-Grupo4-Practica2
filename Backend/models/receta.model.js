module.exports = (sequelize, DataTypes) => {
  const Receta = sequelize.define('Receta', {
    id_receta: {
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
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El título es requerido'
        },
        len: {
          args: [1, 150],
          msg: 'El título no puede exceder 150 caracteres'
        }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cuerpo: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    foto_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    visibilidad: {
      type: DataTypes.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'public',
      validate: {
        isIn: {
          args: [['public', 'private']],
          msg: 'La visibilidad debe ser "public" o "private"'
        }
      }
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'recetas',
    timestamps: false
  });
  
  return Receta;
};
