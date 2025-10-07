module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El username es requerido'
        },
        len: {
          args: [1, 32],
          msg: 'El username no puede exceder 32 caracteres'
        }
      }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El email es requerido'
        },
        isEmail: {
          msg: 'Debe ser un email válido'
        },
        len: {
          args: [1, 150],
          msg: 'El email no puede exceder 150 caracteres'
        }
      }
    },
    password_hash: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La contraseña es requerida'
        }
      }
    },
    foto_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    creado_en: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
    // Excluir password_hash por defecto en las respuestas JSON
    defaultScope: {
      attributes: { exclude: ['password_hash'] }
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password_hash'] }
      }
    }
  });
  
  return Usuario;
};
