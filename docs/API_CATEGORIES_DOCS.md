# API de Categorías - RecipeBox

## 📋 Endpoints Disponibles

### Base URL

```
http://localhost:8080/categorias
```

---

## 🔓 Endpoints Públicos (No requieren autenticación)

### 1. Obtener Todas las Categorías (con paginación)

**GET** `/categorias`

Obtiene todas las categorías con paginación y búsqueda.

**Query Parameters (opcionales):**

- `page` - Número de página (default: 1)
- `limit` - Cantidad por página (default: 10)
- `search` - Buscar por nombre

**Ejemplos de URL:**

```
GET /categorias
GET /categorias?page=1&limit=5
GET /categorias?search=postre
GET /categorias?page=2&limit=10&search=italiana
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": [
    {
      "id_categoria": 1,
      "nombre": "Postres",
      "descripcion": "Recetas dulces y postres deliciosos"
    },
    {
      "id_categoria": 2,
      "nombre": "Comida Italiana",
      "descripcion": "Pizzas, pastas y más"
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

---

### 2. Obtener Categoría por ID

**GET** `/categorias/:id`

Obtiene una categoría específica por su ID.

**Parámetros de URL:**

- `id` - ID de la categoría

**Ejemplo:**

```
GET /categorias/1
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id_categoria": 1,
    "nombre": "Postres",
    "descripcion": "Recetas dulces y postres deliciosos"
  }
}
```

**Errores Posibles:**

- `400`: Categoría no encontrada

---

### 3. Obtener Categoría con sus Recetas

**GET** `/categorias/:id/recetas`

Obtiene una categoría con todas sus recetas asociadas.

**Parámetros de URL:**

- `id` - ID de la categoría

**Ejemplo:**

```
GET /categorias/1/recetas
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id_categoria": 1,
    "nombre": "Postres",
    "descripcion": "Recetas dulces y postres deliciosos",
    "recetas": [
      {
        "id_receta": 5,
        "titulo": "Tarta de Chocolate",
        "descripcion": "Deliciosa tarta de chocolate",
        "foto_url": "https://example.com/foto.jpg",
        "visibilidad": "public",
        "creado_en": "2025-10-06T12:00:00.000Z"
      },
      {
        "id_receta": 8,
        "titulo": "Cheesecake",
        "descripcion": "Cremoso cheesecake de fresa",
        "foto_url": "https://example.com/foto2.jpg",
        "visibilidad": "public",
        "creado_en": "2025-10-06T13:00:00.000Z"
      }
    ]
  }
}
```

---

### 4. Obtener Estadísticas de Categorías

**GET** `/categorias/stats`

Obtiene estadísticas generales de las categorías.

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "total_categorias": 15
  }
}
```

---

## 🔒 Endpoints Privados (Requieren autenticación)

**Header requerido:**

```
Authorization: Bearer <token>
```

### 5. Crear Nueva Categoría

**POST** `/categorias`

Crea una nueva categoría (requiere autenticación).

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Body:**

```json
{
  "nombre": "Comida Mexicana",
  "descripcion": "Tacos, enchiladas y más platillos mexicanos"
}
```

**Nota:** Solo `nombre` es requerido, `descripcion` es opcional.

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id_categoria": 10,
    "nombre": "Comida Mexicana",
    "descripcion": "Tacos, enchiladas y más platillos mexicanos"
  }
}
```

**Errores Posibles:**

- `400`: Nombre es requerido
- `400`: Ya existe una categoría con ese nombre
- `401`: Token no proporcionado o inválido

---

### 6. Actualizar Categoría

**PUT** `/categorias/:id`

Actualiza una categoría existente (requiere autenticación).

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Parámetros de URL:**

- `id` - ID de la categoría

**Body (todos los campos son opcionales):**

```json
{
  "nombre": "Comida Mexicana Tradicional",
  "descripcion": "Platillos tradicionales de México"
}
```

**Ejemplo:**

```
PUT /categorias/10
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Categoría actualizada exitosamente",
  "data": {
    "id_categoria": 10,
    "nombre": "Comida Mexicana Tradicional",
    "descripcion": "Platillos tradicionales de México"
  }
}
```

**Errores Posibles:**

- `400`: Categoría no encontrada
- `400`: Ya existe una categoría con ese nombre
- `401`: Token no proporcionado o inválido

---

### 7. Eliminar Categoría

**DELETE** `/categorias/:id`

Elimina una categoría (requiere autenticación).

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Parámetros de URL:**

- `id` - ID de la categoría

**Ejemplo:**

```
DELETE /categorias/10
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente"
}
```

**Errores Posibles:**

- `400`: Categoría no encontrada
- `400`: No se puede eliminar porque tiene recetas asociadas
- `401`: Token no proporcionado o inválido

---

## 🧪 Ejemplos con cURL

### Obtener todas las categorías

```bash
curl -X GET http://localhost:8080/categorias
```

### Obtener categorías con paginación y búsqueda

```bash
curl -X GET "http://localhost:8080/categorias?page=1&limit=5&search=postre"
```

### Obtener categoría por ID

```bash
curl -X GET http://localhost:8080/categorias/1
```

### Obtener categoría con sus recetas

```bash
curl -X GET http://localhost:8080/categorias/1/recetas
```

### Crear nueva categoría (con token)

```bash
curl -X POST http://localhost:8080/categorias \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Comida Mexicana",
    "descripcion": "Tacos, enchiladas y más"
  }'
```

### Actualizar categoría (con token)

```bash
curl -X PUT http://localhost:8080/categorias/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Postres Premium",
    "descripcion": "Los mejores postres gourmet"
  }'
```

### Eliminar categoría (con token)

```bash
curl -X DELETE http://localhost:8080/categorias/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## 🧪 Ejemplos con JavaScript (Fetch)

### Obtener todas las categorías

```javascript
const response = await fetch("http://localhost:8080/categorias");
const data = await response.json();
console.log(data);
```

### Obtener categorías con filtros

```javascript
const params = new URLSearchParams({
  page: 1,
  limit: 10,
  search: "postre",
});

const response = await fetch(`http://localhost:8080/categorias?${params}`);
const data = await response.json();
console.log(data);
```

### Crear categoría (con token)

```javascript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:8080/categorias", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nombre: "Comida Italiana",
    descripcion: "Pizzas, pastas y más",
  }),
});

const data = await response.json();
console.log(data);
```

### Actualizar categoría (con token)

```javascript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:8080/categorias/1", {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    nombre: "Comida Italiana Premium",
  }),
});

const data = await response.json();
console.log(data);
```

### Eliminar categoría (con token)

```javascript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:8080/categorias/1", {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log(data);
```

---

## 📝 Validaciones

### Nombre

- ✅ Requerido
- ✅ Máximo 50 caracteres
- ✅ Debe ser único

### Descripción

- ⭕ Opcional
- ✅ Tipo TEXT (sin límite específico)

---

## 🎯 Casos de Uso

### 1. Sistema de Filtrado

```javascript
// Obtener todas las categorías para un select/dropdown
fetch("/categorias?limit=100")
  .then((res) => res.json())
  .then((data) => {
    const select = document.getElementById("categoria");
    data.data.forEach((cat) => {
      const option = new Option(cat.nombre, cat.id_categoria);
      select.add(option);
    });
  });
```

### 2. Mostrar Recetas por Categoría

```javascript
// Obtener categoría con sus recetas
fetch("/categorias/1/recetas")
  .then((res) => res.json())
  .then((data) => {
    console.log(`Categoría: ${data.data.nombre}`);
    console.log(`Recetas: ${data.data.recetas.length}`);
  });
```

---

## ⚠️ Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los datos enviados
- `401`: No autorizado (token inválido/expirado)
- `404`: Recurso no encontrado
- `409`: Conflicto (nombre duplicado)
- `500`: Error interno del servidor

---

## 📚 Notas Importantes

1. **Autenticación**: Solo crear, actualizar y eliminar requieren token
2. **Paginación**: Por defecto muestra 10 categorías por página
3. **Búsqueda**: Case-insensitive y busca coincidencias parciales
4. **Eliminación**: No se puede eliminar una categoría con recetas asociadas
5. **Nombres únicos**: No puede haber dos categorías con el mismo nombre
