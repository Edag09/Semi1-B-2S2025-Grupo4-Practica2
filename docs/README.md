# Modelos Sequelize - RecipeBox

## 📋 Descripción

Todos los modelos han sido migrados a Sequelize ORM, lo que proporciona:

- Validaciones automáticas
- Relaciones entre tablas
- Métodos CRUD simplificados
- Migraciones y sincronización de esquemas

## 🗂️ Estructura de Modelos

### 1. Usuario (`usuario.model.js`)

```javascript
{
  id_usuario: INTEGER (PK, Auto Increment),
  username: STRING(32) (Unique, Required),
  email: STRING(150) (Unique, Required, Email),
  password_hash: STRING(100) (Required),
  foto_url: STRING(255) (Optional),
  creado_en: DATE (Default: NOW)
}
```

**Características especiales:**

- Por defecto NO devuelve `password_hash` en las consultas
- Usa `Usuario.scope('withPassword')` para incluir la contraseña (útil para login)

### 2. Receta (`receta.model.js`)

```javascript
{
  id_receta: INTEGER (PK, Auto Increment),
  id_usuario: INTEGER (FK -> usuarios),
  titulo: STRING(150) (Required),
  descripcion: TEXT,
  cuerpo: TEXT,
  foto_url: STRING(255),
  visibilidad: ENUM('public', 'private') (Default: 'public'),
  creado_en: DATE (Default: NOW)
}
```

### 3. Categoria (`categoria.model.js`)

```javascript
{
  id_categoria: INTEGER (PK, Auto Increment),
  nombre: STRING(50) (Unique, Required),
  descripcion: TEXT
}
```

### 4. Favorito (`favorito.model.js`)

```javascript
{
  id_favorito: INTEGER (PK, Auto Increment),
  id_usuario: INTEGER (FK -> usuarios),
  id_receta: INTEGER (FK -> recetas),
  creado_en: DATE (Default: NOW)
}
```

**Restricción:** Un usuario no puede agregar la misma receta a favoritos dos veces (índice único)

### 5. Comentario (`comentario.model.js`)

```javascript
{
  id_comentario: INTEGER (PK, Auto Increment),
  id_usuario: INTEGER (FK -> usuarios),
  id_receta: INTEGER (FK -> recetas),
  contenido: STRING(1000) (Required),
  creado_en: DATE (Default: NOW)
}
```

### 6. RecetaCategoria (`receta-categoria.model.js`)

```javascript
{
  id_receta: INTEGER (PK, FK -> recetas),
  id_categoria: INTEGER (PK, FK -> categorias)
}
```

Tabla intermedia para la relación N:M entre Recetas y Categorías.

## 🔗 Relaciones

Las relaciones están definidas en `models/index.js`:

```javascript
// Usuario -> Recetas (1:N)
Usuario.hasMany(Receta, { foreignKey: "id_usuario", as: "recetas" });
Receta.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// Usuario -> Favoritos (1:N)
Usuario.hasMany(Favorito, { foreignKey: "id_usuario", as: "favoritos" });
Favorito.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// Receta -> Favoritos (1:N)
Receta.hasMany(Favorito, { foreignKey: "id_receta", as: "favoritos" });
Favorito.belongsTo(Receta, { foreignKey: "id_receta", as: "receta" });

// Usuario -> Comentarios (1:N)
Usuario.hasMany(Comentario, { foreignKey: "id_usuario", as: "comentarios" });
Comentario.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// Receta -> Comentarios (1:N)
Receta.hasMany(Comentario, { foreignKey: "id_receta", as: "comentarios" });
Comentario.belongsTo(Receta, { foreignKey: "id_receta", as: "receta" });

// Receta <-> Categorias (N:M)
Receta.belongsToMany(Categoria, {
  through: RecetaCategoria,
  foreignKey: "id_receta",
  otherKey: "id_categoria",
  as: "categorias",
});
Categoria.belongsToMany(Receta, {
  through: RecetaCategoria,
  foreignKey: "id_categoria",
  otherKey: "id_receta",
  as: "recetas",
});
```

## 💻 Uso Básico

### Importar modelos

```javascript
const {
  Usuario,
  Receta,
  Categoria,
  Favorito,
  Comentario,
} = require("./models");
```

### Crear un registro

```javascript
const usuario = await Usuario.create({
  username: "juan123",
  email: "juan@example.com",
  password_hash: "hash_aqui",
});
```

### Buscar por ID

```javascript
const usuario = await Usuario.findByPk(1);
```

### Buscar con filtros

```javascript
const usuarios = await Usuario.findAll({
  where: { username: "juan123" },
});
```

### Buscar con relaciones

```javascript
const receta = await Receta.findByPk(1, {
  include: [
    {
      model: Usuario,
      as: "usuario",
      attributes: ["username", "foto_url"],
    },
    {
      model: Categoria,
      as: "categorias",
    },
  ],
});
```

### Actualizar

```javascript
await Usuario.update(
  { foto_url: "nueva_url.jpg" },
  { where: { id_usuario: 1 } }
);
```

### Eliminar

```javascript
await Usuario.destroy({
  where: { id_usuario: 1 },
});
```

## 🎯 Ejemplos Avanzados

Consulta el archivo `models/ejemplos-uso.js` para ver ejemplos completos de:

- CRUD completo
- Relaciones complejas
- Paginación
- Filtros avanzados
- Manejo de favoritos
- Comentarios con relaciones

## ⚙️ Configuración

La configuración de Sequelize se encuentra en `config/db.js` y usa las siguientes variables de entorno:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=admin
DB_NAME=recipebox_db
DB_PORT=3306
```

## 🔍 Validaciones

Cada modelo incluye validaciones automáticas:

- Campos requeridos (`allowNull: false`)
- Longitud de strings (`len: [min, max]`)
- Formato de email (`isEmail`)
- Valores únicos (`unique: true`)
- Valores ENUM (`isIn: [...]`)

## 🚀 Sincronización

Para sincronizar los modelos con la base de datos (crear/actualizar tablas automáticamente):

```javascript
// En desarrollo - actualiza la estructura sin perder datos
await sequelize.sync({ alter: true });

// Recrear todas las tablas (CUIDADO: borra todos los datos)
await sequelize.sync({ force: true });
```

**Nota:** En producción, es mejor usar migraciones en lugar de `sync()`.

## 📚 Recursos

- [Documentación de Sequelize](https://sequelize.org/)
- [Guía de Asociaciones](https://sequelize.org/docs/v6/core-concepts/assocs/)
- [Validaciones](https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/)
