# 📋 RecipeBox API - Endpoints Reference

## 🌐 Base URL: `http://localhost:8080`

---

## 🔐 AUTENTICACIÓN - `/auth`

| Método | Endpoint                 | Requiere Auth | Descripción                |
| ------ | ------------------------ | ------------- | -------------------------- |
| POST   | `/auth/register`         | ❌            | Registrar nuevo usuario    |
| POST   | `/auth/login`            | ❌            | Iniciar sesión             |
| GET    | `/auth/perfil`           | ✅            | Obtener perfil del usuario |
| PUT    | `/auth/perfil`           | ✅            | Actualizar perfil          |
| PUT    | `/auth/cambiar-password` | ✅            | Cambiar contraseña         |

---

## 📂 CATEGORÍAS - `/categorias`

| Método | Endpoint                  | Requiere Auth | Descripción                            |
| ------ | ------------------------- | ------------- | -------------------------------------- |
| POST   | `/categorias`             | ✅            | Crear nueva categoría                  |
| GET    | `/categorias`             | ❌            | Listar todas las categorías (paginado) |
| GET    | `/categorias/:id`         | ❌            | Obtener categoría por ID               |
| GET    | `/categorias/:id/recetas` | ❌            | Obtener categoría con sus recetas      |
| PUT    | `/categorias/:id`         | ✅            | Actualizar categoría                   |
| DELETE | `/categorias/:id`         | ✅            | Eliminar categoría                     |
| GET    | `/categorias/:id/stats`   | ❌            | Estadísticas de la categoría           |

**Query Params para GET /categorias:**

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10)
- `search` - Buscar por nombre

---

## 🍽️ RECETAS - `/recetas`

| Método | Endpoint               | Requiere Auth | Descripción                                 |
| ------ | ---------------------- | ------------- | ------------------------------------------- |
| POST   | `/recetas`             | ✅            | Crear nueva receta                          |
| GET    | `/recetas`             | ❌            | Listar recetas públicas (paginado, filtros) |
| GET    | `/recetas/:id`         | ❌            | Obtener receta por ID con relaciones        |
| GET    | `/recetas/mis-recetas` | ✅            | Obtener mis recetas (públicas y privadas)   |
| GET    | `/recetas/populares`   | ❌            | Obtener recetas más populares               |
| PUT    | `/recetas/:id`         | ✅            | Actualizar receta (solo el autor)           |
| DELETE | `/recetas/:id`         | ✅            | Eliminar receta (solo el autor)             |

**Query Params para GET /recetas:**

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10)
- `search` - Buscar por título
- `categoriaId` - Filtrar por categoría
- `userId` - Filtrar por usuario
- `esPublica` - Filtrar por visibilidad (true/false)

**Query Params para GET /recetas/populares:**

- `limit` - Número de recetas a obtener (default: 10)

---

## ⭐ FAVORITOS - `/favoritos`

| Método | Endpoint                     | Requiere Auth | Descripción                              |
| ------ | ---------------------------- | ------------- | ---------------------------------------- |
| POST   | `/favoritos/:recetaId`       | ✅            | Agregar receta a favoritos               |
| GET    | `/favoritos`                 | ✅            | Obtener mis recetas favoritas (paginado) |
| GET    | `/favoritos/check/:recetaId` | ✅            | Verificar si receta es favorita          |
| DELETE | `/favoritos/:recetaId`       | ✅            | Quitar receta de favoritos               |
| GET    | `/favoritos/stats`           | ✅            | Estadísticas de mis favoritos            |

**Query Params para GET /favoritos:**

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 10)

---

## 💬 COMENTARIOS - `/comentarios`

| Método | Endpoint                        | Requiere Auth | Descripción                           |
| ------ | ------------------------------- | ------------- | ------------------------------------- |
| POST   | `/comentarios/:recetaId`        | ✅            | Crear comentario en una receta        |
| GET    | `/comentarios/receta/:recetaId` | ✅            | Obtener comentarios de una receta     |
| GET    | `/comentarios/mis-comentarios`  | ✅            | Obtener mis comentarios               |
| PUT    | `/comentarios/:id`              | ✅            | Actualizar comentario (solo el autor) |
| DELETE | `/comentarios/:id`              | ✅            | Eliminar comentario (solo el autor)   |

**Query Params para GET comentarios:**

- `page` - Número de página (default: 1)
- `limit` - Elementos por página (default: 20 para receta, 10 para usuario)

---

## 📊 RESUMEN DE ENDPOINTS

| Módulo        | Total Endpoints | Públicos | Protegidos |
| ------------- | --------------- | -------- | ---------- |
| Autenticación | 5               | 2        | 3          |
| Categorías    | 7               | 4        | 3          |
| Recetas       | 7               | 3        | 4          |
| Favoritos     | 5               | 0        | 5          |
| Comentarios   | 5               | 0        | 5          |
| **TOTAL**     | **29**          | **9**    | **20**     |

---

## 🔑 AUTENTICACIÓN

### Endpoints públicos (no requieren token):

- POST `/auth/register`
- POST `/auth/login`
- GET `/categorias`
- GET `/categorias/:id`
- GET `/categorias/:id/recetas`
- GET `/categorias/:id/stats`
- GET `/recetas`
- GET `/recetas/:id`
- GET `/recetas/populares`

### Endpoints protegidos (requieren Bearer Token):

Todos los demás endpoints requieren el header:

```
Authorization: Bearer <token>
```

---

## 📝 EJEMPLOS DE REQUESTS

### 1. Registrar Usuario

```http
POST /auth/register
Content-Type: application/json

{
  "username": "juanperez",
  "email": "juan@ejemplo.com",
  "password": "miPassword123"
}
```

### 2. Crear Receta

```http
POST /recetas
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "titulo": "Pastel de Chocolate",
  "descripcion": "Delicioso pastel casero",
  "ingredientes": "Harina, azúcar, cacao, huevos",
  "instrucciones": "1. Mezclar secos. 2. Agregar húmedos...",
  "foto_url": "https://ejemplo.com/foto.jpg",
  "tiempo_preparacion": 60,
  "porciones": 8,
  "es_publica": true,
  "categorias": [1, 2]
}
```

### 3. Listar Recetas Filtradas

```http
GET /recetas?search=chocolate&categoriaId=1&page=1&limit=10
```

### 4. Agregar a Favoritos

```http
POST /favoritos/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Comentar en Receta

```http
POST /comentarios/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "contenido": "¡Excelente receta! 😋"
}
```

---

## 📤 FORMATO DE RESPUESTAS

### Respuesta Exitosa (2xx)

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": {
    /* datos */
  },
  "pagination": {
    /* si aplica */
  }
}
```

### Respuesta con Error (4xx, 5xx)

```json
{
  "error": "Mensaje de error descriptivo"
}
```

### Respuesta con Paginación

```json
{
  "success": true,
  "data": [
    /* array de elementos */
  ],
  "pagination": {
    "total": 25,
    "totalPages": 3,
    "currentPage": 1,
    "perPage": 10
  }
}
```

---

## 🚦 CÓDIGOS HTTP

| Código | Significado  | Cuándo se usa                        |
| ------ | ------------ | ------------------------------------ |
| 200    | OK           | Operación exitosa (GET, PUT, DELETE) |
| 201    | Created      | Recurso creado exitosamente (POST)   |
| 400    | Bad Request  | Datos inválidos o faltantes          |
| 401    | Unauthorized | Token faltante o inválido            |
| 403    | Forbidden    | Sin permiso para esta acción         |
| 404    | Not Found    | Recurso no existe                    |
| 409    | Conflict     | Conflicto (ej: email ya existe)      |
| 500    | Server Error | Error interno del servidor           |

---

## 🎯 RUTAS POR FUNCIONALIDAD

### Gestión de Usuarios

- Registro: POST `/auth/register`
- Login: POST `/auth/login`
- Perfil: GET `/auth/perfil`
- Actualizar perfil: PUT `/auth/perfil`
- Cambiar password: PUT `/auth/cambiar-password`

### Gestión de Recetas

- Crear: POST `/recetas`
- Listar públicas: GET `/recetas`
- Mis recetas: GET `/recetas/mis-recetas`
- Por ID: GET `/recetas/:id`
- Populares: GET `/recetas/populares`
- Actualizar: PUT `/recetas/:id`
- Eliminar: DELETE `/recetas/:id`

### Interacción Social

- Favoritos: POST, GET, DELETE `/favoritos/:recetaId`
- Comentarios: POST, GET, PUT, DELETE `/comentarios`

### Organización

- Categorías: CRUD completo en `/categorias`

---

## 🔍 BÚSQUEDA Y FILTROS

### Búsqueda de Recetas

```
GET /recetas?search=pastel
```

### Filtro por Categoría

```
GET /recetas?categoriaId=1
```

### Filtro por Usuario

```
GET /recetas?userId=1
```

### Filtro por Visibilidad

```
GET /recetas?esPublica=true
```

### Combinación de Filtros

```
GET /recetas?search=chocolate&categoriaId=1&esPublica=true&page=1&limit=5
```

---

## 📱 RELACIONES ENTRE RECURSOS

```
Usuario
  ├── 1:N → Recetas
  ├── 1:N → Favoritos
  └── 1:N → Comentarios

Receta
  ├── N:1 → Usuario (autor)
  ├── N:M → Categorías
  ├── 1:N → Favoritos
  └── 1:N → Comentarios

Categoría
  └── N:M → Recetas
```

---

## ✅ VALIDACIONES

### Usuario

- `username`: 3-30 caracteres, alfanumérico
- `email`: formato válido, único
- `password`: mínimo 6 caracteres

### Receta

- `titulo`: requerido, máx 200 caracteres
- `ingredientes`: requerido, máx 2000 caracteres
- `instrucciones`: requerido, máx 5000 caracteres
- `tiempo_preparacion`: entero positivo
- `porciones`: entero positivo
- `es_publica`: booleano
- `categorias`: array de IDs de categorías existentes

### Categoría

- `nombre`: requerido, único, máx 50 caracteres
- `descripcion`: opcional, máx 500 caracteres

### Comentario

- `contenido`: requerido, máx 1000 caracteres

---

## 🎨 MEJORES PRÁCTICAS

1. **Siempre incluye el token** en endpoints protegidos
2. **Usa paginación** para listados grandes
3. **Valida los datos** antes de enviar
4. **Maneja errores** apropiadamente en el cliente
5. **Respeta los permisos** (no intentes editar recursos ajenos)

---

**📚 Ver documentación completa en:** `API_COMPLETE_DOCS.md`

**🚀 Ver guía de inicio rápido en:** `POSTMAN_QUICKSTART.md`

**📊 Ver resumen del proyecto en:** `RESUMEN_COMPLETO.md`

---

¡API RecipeBox lista para usar! 🎉
