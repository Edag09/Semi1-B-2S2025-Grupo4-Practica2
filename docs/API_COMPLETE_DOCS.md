# 📘 API RecipeBox - Documentación Completa

## 🌐 Base URL

```
http://localhost:8080
```

---

## 🔐 AUTENTICACIÓN

### 1. Registrar Usuario

**POST** `/auth/register`

```json
{
  "username": "juanperez",
  "email": "juan@ejemplo.com",
  "password": "miPassword123"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id_usuario": 1,
    "username": "juanperez",
    "email": "juan@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login

**POST** `/auth/login`

```json
{
  "email": "juan@ejemplo.com",
  "password": "miPassword123"
}
```

### 3. Ver Perfil

**GET** `/auth/perfil`

**Headers:**

```
Authorization: Bearer <tu_token>
```

### 4. Actualizar Perfil

**PUT** `/auth/perfil`

**Headers:** Authorization Bearer

```json
{
  "username": "juanperez2",
  "foto_url": "https://ejemplo.com/foto.jpg"
}
```

### 5. Cambiar Contraseña

**PUT** `/auth/cambiar-password`

**Headers:** Authorization Bearer

```json
{
  "currentPassword": "miPassword123",
  "newPassword": "nuevoPassword456"
}
```

---

## 📂 CATEGORÍAS

### 1. Crear Categoría

**POST** `/categorias`

**Headers:** Authorization Bearer

```json
{
  "nombre": "Postres",
  "descripcion": "Dulces y deliciosos"
}
```

### 2. Listar Todas las Categorías

**GET** `/categorias`

**Query Params (opcionales):**

- `page=1` - Número de página
- `limit=10` - Elementos por página
- `search=postre` - Buscar por nombre

**Ejemplo:** `GET /categorias?page=1&limit=10&search=post`

### 3. Obtener Categoría por ID

**GET** `/categorias/:id`

**Ejemplo:** `GET /categorias/1`

### 4. Obtener Categoría con sus Recetas

**GET** `/categorias/:id/recetas`

**Ejemplo:** `GET /categorias/1/recetas`

### 5. Actualizar Categoría

**PUT** `/categorias/:id`

**Headers:** Authorization Bearer

```json
{
  "nombre": "Postres Caseros",
  "descripcion": "Los mejores postres caseros"
}
```

### 6. Eliminar Categoría

**DELETE** `/categorias/:id`

**Headers:** Authorization Bearer

### 7. Estadísticas de Categoría

**GET** `/categorias/:id/stats`

**Ejemplo:** `GET /categorias/1/stats`

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "categoria": "Postres",
    "totalRecetas": 15,
    "recetasPublicas": 12,
    "recetasPrivadas": 3
  }
}
```

---

## 🍽️ RECETAS

### 1. Crear Receta

**POST** `/recetas`

**Headers:** Authorization Bearer

```json
{
  "titulo": "Pastel de Chocolate",
  "descripcion": "Un delicioso pastel de chocolate",
  "ingredientes": "Harina, azúcar, cacao, huevos, mantequilla",
  "instrucciones": "1. Mezclar ingredientes secos. 2. Agregar huevos...",
  "foto_url": "https://ejemplo.com/pastel.jpg",
  "tiempo_preparacion": 60,
  "porciones": 8,
  "es_publica": true,
  "categorias": [1, 2]
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Receta creada exitosamente",
  "data": {
    "id_receta": 1,
    "titulo": "Pastel de Chocolate",
    "descripcion": "Un delicioso pastel de chocolate",
    "ingredientes": "Harina, azúcar, cacao, huevos, mantequilla",
    "instrucciones": "1. Mezclar ingredientes secos...",
    "foto_url": "https://ejemplo.com/pastel.jpg",
    "tiempo_preparacion": 60,
    "porciones": 8,
    "es_publica": true,
    "id_usuario": 1,
    "creado_en": "2025-01-01T10:00:00.000Z",
    "categorias": [
      {
        "id_categoria": 1,
        "nombre": "Postres"
      },
      {
        "id_categoria": 2,
        "nombre": "Chocolate"
      }
    ]
  }
}
```

### 2. Listar Recetas

**GET** `/recetas`

**Query Params (opcionales):**

- `page=1` - Número de página
- `limit=10` - Elementos por página
- `search=chocolate` - Buscar por título
- `categoriaId=1` - Filtrar por categoría
- `userId=1` - Filtrar por usuario
- `esPublica=true` - Solo públicas o privadas

**Ejemplos:**

- `GET /recetas?page=1&limit=10` - Todas las recetas públicas
- `GET /recetas?search=pastel` - Buscar "pastel"
- `GET /recetas?categoriaId=1` - Recetas de categoría "Postres"
- `GET /recetas?userId=1&esPublica=false` - Mis recetas privadas

### 3. Obtener Receta por ID

**GET** `/recetas/:id`

**Ejemplo:** `GET /recetas/1`

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "id_receta": 1,
    "titulo": "Pastel de Chocolate",
    "descripcion": "Un delicioso pastel de chocolate",
    "ingredientes": "Harina, azúcar, cacao...",
    "instrucciones": "1. Mezclar ingredientes secos...",
    "foto_url": "https://ejemplo.com/pastel.jpg",
    "tiempo_preparacion": 60,
    "porciones": 8,
    "es_publica": true,
    "usuario": {
      "id_usuario": 1,
      "username": "juanperez",
      "foto_url": "https://ejemplo.com/juan.jpg"
    },
    "categorias": [
      {
        "id_categoria": 1,
        "nombre": "Postres"
      }
    ],
    "stats": {
      "totalFavoritos": 25,
      "totalComentarios": 8
    }
  }
}
```

### 4. Obtener Mis Recetas

**GET** `/recetas/mis-recetas`

**Headers:** Authorization Bearer

**Query Params:** `page`, `limit`, `search`, `esPublica`

### 5. Obtener Recetas Populares

**GET** `/recetas/populares`

**Query Params:** `limit=5` (opcional, default: 10)

**Ejemplo:** `GET /recetas/populares?limit=5`

### 6. Actualizar Receta

**PUT** `/recetas/:id`

**Headers:** Authorization Bearer

```json
{
  "titulo": "Pastel de Chocolate Mejorado",
  "descripcion": "Ahora con más chocolate",
  "tiempo_preparacion": 70,
  "porciones": 10,
  "es_publica": false,
  "categorias": [1, 3]
}
```

### 7. Eliminar Receta

**DELETE** `/recetas/:id`

**Headers:** Authorization Bearer

---

## ⭐ FAVORITOS

### 1. Agregar a Favoritos

**POST** `/favoritos/:recetaId`

**Headers:** Authorization Bearer

**Ejemplo:** `POST /favoritos/1`

**Respuesta:**

```json
{
  "success": true,
  "message": "Receta agregada a favoritos",
  "data": {
    "id_favorito": 1,
    "id_usuario": 1,
    "id_receta": 1,
    "creado_en": "2025-01-01T10:00:00.000Z"
  }
}
```

### 2. Ver Mis Favoritos

**GET** `/favoritos`

**Headers:** Authorization Bearer

**Query Params:** `page=1`, `limit=10`

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id_favorito": 1,
      "creado_en": "2025-01-01T10:00:00.000Z",
      "receta": {
        "id_receta": 1,
        "titulo": "Pastel de Chocolate",
        "descripcion": "Un delicioso pastel",
        "foto_url": "https://ejemplo.com/pastel.jpg",
        "tiempo_preparacion": 60,
        "porciones": 8,
        "usuario": {
          "id_usuario": 2,
          "username": "chef_maria"
        }
      }
    }
  ],
  "pagination": {
    "total": 15,
    "totalPages": 2,
    "currentPage": 1,
    "perPage": 10
  }
}
```

### 3. Verificar si es Favorito

**GET** `/favoritos/check/:recetaId`

**Headers:** Authorization Bearer

**Ejemplo:** `GET /favoritos/check/1`

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "esFavorito": true
  }
}
```

### 4. Quitar de Favoritos

**DELETE** `/favoritos/:recetaId`

**Headers:** Authorization Bearer

**Ejemplo:** `DELETE /favoritos/1`

### 5. Estadísticas de Favoritos

**GET** `/favoritos/stats`

**Headers:** Authorization Bearer

**Respuesta:**

```json
{
  "success": true,
  "data": {
    "totalFavoritos": 15,
    "ultimoAgregado": "2025-01-01T10:00:00.000Z"
  }
}
```

---

## 💬 COMENTARIOS

### 1. Crear Comentario

**POST** `/comentarios/:recetaId`

**Headers:** Authorization Bearer

**Ejemplo:** `POST /comentarios/1`

```json
{
  "contenido": "¡Excelente receta! Me quedó delicioso"
}
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Comentario creado exitosamente",
  "data": {
    "id_comentario": 1,
    "contenido": "¡Excelente receta! Me quedó delicioso",
    "id_usuario": 1,
    "id_receta": 1,
    "creado_en": "2025-01-01T10:00:00.000Z",
    "usuario": {
      "id_usuario": 1,
      "username": "juanperez",
      "foto_url": "https://ejemplo.com/juan.jpg"
    },
    "receta": {
      "id_receta": 1,
      "titulo": "Pastel de Chocolate"
    }
  }
}
```

### 2. Ver Comentarios de una Receta

**GET** `/comentarios/receta/:recetaId`

**Headers:** Authorization Bearer

**Query Params:** `page=1`, `limit=20`

**Ejemplo:** `GET /comentarios/receta/1?page=1&limit=10`

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "id_comentario": 1,
      "contenido": "¡Excelente receta! Me quedó delicioso",
      "creado_en": "2025-01-01T10:00:00.000Z",
      "usuario": {
        "id_usuario": 1,
        "username": "juanperez",
        "foto_url": "https://ejemplo.com/juan.jpg"
      }
    }
  ],
  "pagination": {
    "total": 8,
    "totalPages": 1,
    "currentPage": 1,
    "perPage": 20
  }
}
```

### 3. Ver Mis Comentarios

**GET** `/comentarios/mis-comentarios`

**Headers:** Authorization Bearer

**Query Params:** `page=1`, `limit=10`

### 4. Actualizar Comentario

**PUT** `/comentarios/:id`

**Headers:** Authorization Bearer

**Ejemplo:** `PUT /comentarios/1`

```json
{
  "contenido": "¡Excelente receta! Actualicé mi comentario"
}
```

### 5. Eliminar Comentario

**DELETE** `/comentarios/:id`

**Headers:** Authorization Bearer

**Ejemplo:** `DELETE /comentarios/1`

---

## 🔧 CÓDIGOS DE ESTADO HTTP

- **200 OK** - Solicitud exitosa
- **201 Created** - Recurso creado exitosamente
- **400 Bad Request** - Error en la solicitud (datos inválidos)
- **401 Unauthorized** - No autenticado (token faltante o inválido)
- **403 Forbidden** - No tienes permiso para esta acción
- **404 Not Found** - Recurso no encontrado
- **409 Conflict** - Conflicto (ej: email ya existe)
- **500 Internal Server Error** - Error del servidor

---

## ⚠️ ERRORES COMUNES

### Error 401: Token no válido

```json
{
  "error": "Token inválido o expirado"
}
```

**Solución:** Hacer login nuevamente para obtener un nuevo token.

### Error 403: Sin permiso

```json
{
  "error": "No tienes permiso para editar esta receta"
}
```

**Solución:** Solo puedes editar/eliminar tus propios recursos.

### Error 404: No encontrado

```json
{
  "error": "Receta no encontrada"
}
```

**Solución:** Verificar que el ID sea correcto.

---

## 📝 NOTAS IMPORTANTES

1. **Autenticación**: Todos los endpoints excepto `/auth/register` y `/auth/login` requieren el header `Authorization: Bearer <token>`

2. **Paginación**: Los endpoints de listado aceptan `page` y `limit` como query params

3. **Búsqueda**: Usa el param `search` para buscar por título/nombre

4. **Recetas públicas/privadas**:
   - Las recetas públicas (`es_publica: true`) son visibles para todos
   - Las recetas privadas solo para el creador

5. **Categorías en recetas**: Puedes asignar múltiples categorías al crear/actualizar recetas

6. **Permisos**: Solo puedes editar/eliminar tus propias recetas, comentarios y categorías

---

## 🧪 PRUEBAS EN POSTMAN

### Flujo de Prueba Completo:

1. **Registrar usuario** → Guardar token
2. **Crear categorías** (Postres, Ensaladas, etc.)
3. **Crear recetas** con categorías asignadas
4. **Agregar recetas a favoritos**
5. **Crear comentarios** en recetas
6. **Listar todo** (recetas, favoritos, comentarios)
7. **Actualizar y eliminar** recursos

### Configurar Token en Postman:

1. Hacer login y copiar el token de la respuesta
2. En cada request ir a **Authorization**
3. Seleccionar **Bearer Token**
4. Pegar el token
5. Enviar request ✅

---

¡Tu API está completa y lista para usar! 🚀
