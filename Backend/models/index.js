const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Configuración de Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Cambiar a console.log para ver las consultas SQL
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Importar modelos
const Usuario = require('./usuario.model')(sequelize, DataTypes);
const Receta = require('./receta.model')(sequelize, DataTypes);
const Categoria = require('./categoria.model')(sequelize, DataTypes);
const Favorito = require('./favorito.model')(sequelize, DataTypes);
const Comentario = require('./comentario.model')(sequelize, DataTypes);
const RecetaCategoria = require('./receta-categoria.model')(sequelize, DataTypes);

// Definir relaciones

// Usuario -> Recetas (1:N)
Usuario.hasMany(Receta, {
  foreignKey: 'id_usuario',
  as: 'recetas'
});
Receta.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// Usuario -> Favoritos (1:N)
Usuario.hasMany(Favorito, {
  foreignKey: 'id_usuario',
  as: 'favoritos'
});
Favorito.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// Receta -> Favoritos (1:N)
Receta.hasMany(Favorito, {
  foreignKey: 'id_receta',
  as: 'favoritos'
});
Favorito.belongsTo(Receta, {
  foreignKey: 'id_receta',
  as: 'receta'
});

// Usuario -> Comentarios (1:N)
Usuario.hasMany(Comentario, {
  foreignKey: 'id_usuario',
  as: 'comentarios'
});
Comentario.belongsTo(Usuario, {
  foreignKey: 'id_usuario',
  as: 'usuario'
});

// Receta -> Comentarios (1:N)
Receta.hasMany(Comentario, {
  foreignKey: 'id_receta',
  as: 'comentarios'
});
Comentario.belongsTo(Receta, {
  foreignKey: 'id_receta',
  as: 'receta'
});

// Receta <-> Categorias (N:M) a través de RecetaCategoria
Receta.belongsToMany(Categoria, {
  through: RecetaCategoria,
  foreignKey: 'id_receta',
  otherKey: 'id_categoria',
  as: 'categorias'
});
Categoria.belongsToMany(Receta, {
  through: RecetaCategoria,
  foreignKey: 'id_categoria',
  otherKey: 'id_receta',
  as: 'recetas'
});

// Exportar todo
module.exports = {
  sequelize,
  Sequelize,
  Usuario,
  Receta,
  Categoria,
  Favorito,
  Comentario,
  RecetaCategoria
};
