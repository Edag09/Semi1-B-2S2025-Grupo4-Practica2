# 📘 Guía Rápida - CRUD de Categorías en Postman

## 🚀 Endpoints Implementados

| Método | Endpoint                  | Descripción                 | Auth |
| ------ | ------------------------- | --------------------------- | ---- |
| GET    | `/categorias`             | Listar todas las categorías | ❌   |
| GET    | `/categorias/:id`         | Ver una categoría           | ❌   |
| GET    | `/categorias/:id/recetas` | Ver categoría con recetas   | ❌   |
| GET    | `/categorias/stats`       | Ver estadísticas            | ❌   |
| POST   | `/categorias`             | Crear categoría             | ✅   |
| PUT    | `/categorias/:id`         | Actualizar categoría        | ✅   |
| DELETE | `/categorias/:id`         | Eliminar categoría          | ✅   |

---

## 📋 Pruebas en Postman

### 1️⃣ Listar Todas las Categorías

**Configuración:**

- Método: `GET`
- URL: `http://localhost:8080/categorias`

**Sin parámetros necesarios**

**Respuesta esperada:**

```json
{
  "success": true,
  "data": [
    {
      "id_categoria": 1,
      "nombre": "Postres",
      "descripcion": "Recetas dulces"
    }
  ],
  "pagination": {
    "total": 1,
    "totalPages": 1,
    "currentPage": 1,
    "perPage": 10
  }
}
```

---

### 2️⃣ Listar con Paginación y Búsqueda

**Configuración:**

- Método: `GET`
- URL: `http://localhost:8080/categorias`

**Query Params (Pestaña Params):**

```
page: 1
limit: 5
search: postre
```

**O en URL directa:**

```
http://localhost:8080/categorias?page=1&limit=5&search=postre
```

---

### 3️⃣ Crear Nueva Categoría (Requiere Token)

**Configuración:**

- Método: `POST`
- URL: `http://localhost:8080/categorias`

**Authorization Tab:**

- Type: `Bearer Token`
- Token: `{{token}}` o tu token

**Body (raw - JSON):**

```json
{
  "nombre": "Comida Mexicana",
  "descripcion": "Tacos, enchiladas y más platillos mexicanos"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id_categoria": 1,
    "nombre": "Comida Mexicana",
    "descripcion": "Tacos, enchiladas y más platillos mexicanos"
  }
}
```

---

### 4️⃣ Ver Categoría por ID

**Configuración:**

- Método: `GET`
- URL: `http://localhost:8080/categorias/1`

(Reemplaza `1` con el ID de la categoría)

---

### 5️⃣ Ver Categoría con sus Recetas

**Configuración:**

- Método: `GET`
- URL: `http://localhost:8080/categorias/1/recetas`

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "id_categoria": 1,
    "nombre": "Postres",
    "descripcion": "Recetas dulces",
    "recetas": [
      {
        "id_receta": 5,
        "titulo": "Tarta de Chocolate",
        "descripcion": "Deliciosa tarta",
        "foto_url": "...",
        "visibilidad": "public",
        "creado_en": "..."
      }
    ]
  }
}
```

---

### 6️⃣ Actualizar Categoría (Requiere Token)

**Configuración:**

- Método: `PUT`
- URL: `http://localhost:8080/categorias/1`

**Authorization Tab:**

- Type: `Bearer Token`
- Token: `{{token}}` o tu token

**Body (raw - JSON):**

```json
{
  "nombre": "Comida Mexicana Tradicional",
  "descripcion": "Platillos tradicionales de México"
}
```

**Nota:** Puedes actualizar solo el campo que necesites:

```json
{
  "nombre": "Nuevo Nombre"
}
```

O solo la descripción:

```json
{
  "descripcion": "Nueva descripción"
}
```

---

### 7️⃣ Eliminar Categoría (Requiere Token)

**Configuración:**

- Método: `DELETE`
- URL: `http://localhost:8080/categorias/1`

**Authorization Tab:**

- Type: `Bearer Token`
- Token: `{{token}}` o tu token

**No requiere Body**

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Categoría eliminada exitosamente"
}
```

---

### 8️⃣ Ver Estadísticas

**Configuración:**

- Método: `GET`
- URL: `http://localhost:8080/categorias/stats`

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "total_categorias": 5
  }
}
```

---

## 🔐 Obtener Token (Para operaciones protegidas)

Antes de crear, actualizar o eliminar categorías, necesitas un token:

### Login

```
POST http://localhost:8080/auth/login

Body:
{
  "email": "tu_email@example.com",
  "password": "tu_password"
}
```

Copia el `token` de la respuesta y úsalo en las peticiones protegidas.

---

## 💡 Tips para Postman

### 1. Guardar Token Automáticamente

En la petición de **Login**, pestaña **Tests**:

```javascript
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("token", response.data.token);
  console.log("✅ Token guardado");
}
```

### 2. Usar Variables de Entorno

Crea variables:

- `base_url` = `http://localhost:8080`
- `token` = (se guarda automáticamente con el script de arriba)

Usa en tus peticiones:

```
{{base_url}}/categorias
Authorization: Bearer {{token}}
```

---

## 🎯 Flujo Completo de Prueba

### Paso 1: Login

```
POST /auth/login
Body: { email, password }
→ Copia el token
```

### Paso 2: Crear Categorías de Prueba

```
POST /categorias (con token)
Body: { "nombre": "Postres", "descripcion": "..." }

POST /categorias (con token)
Body: { "nombre": "Comida Italiana", "descripcion": "..." }

POST /categorias (con token)
Body: { "nombre": "Comida Mexicana", "descripcion": "..." }
```

### Paso 3: Listar Categorías

```
GET /categorias
→ Verifica que aparezcan las 3 categorías
```

### Paso 4: Ver una Categoría

```
GET /categorias/1
→ Verifica los datos
```

### Paso 5: Actualizar

```
PUT /categorias/1 (con token)
Body: { "nombre": "Postres Premium" }
```

### Paso 6: Buscar

```
GET /categorias?search=postre
→ Debe encontrar "Postres Premium"
```

### Paso 7: Estadísticas

```
GET /categorias/stats
→ Debe mostrar total: 3
```

### Paso 8: Eliminar

```
DELETE /categorias/3 (con token)
→ Elimina la última categoría
```

---

## ⚠️ Errores Comunes

### Error: "Token no proporcionado"

**Causa:** No agregaste el token en Authorization
**Solución:**

1. Ve a Authorization tab
2. Type: Bearer Token
3. Token: tu_token_aqui

### Error: "Ya existe una categoría con ese nombre"

**Causa:** El nombre ya está en uso
**Solución:** Usa otro nombre único

### Error: "No se puede eliminar porque tiene recetas asociadas"

**Causa:** La categoría tiene recetas vinculadas
**Solución:** Primero desvincula o elimina las recetas

### Error: "Categoría no encontrada"

**Causa:** El ID no existe
**Solución:** Verifica el ID con GET /categorias

---

## 📊 Validaciones

✅ **Nombre:** Requerido, único, máx 50 caracteres
⭕ **Descripción:** Opcional, sin límite

---

## 🎨 Ejemplo de Categorías para Crear

```json
{ "nombre": "Postres", "descripcion": "Recetas dulces y postres deliciosos" }
{ "nombre": "Comida Italiana", "descripcion": "Pizzas, pastas, risottos" }
{ "nombre": "Comida Mexicana", "descripcion": "Tacos, enchiladas, quesadillas" }
{ "nombre": "Comida Asiática", "descripcion": "Sushi, ramen, pad thai" }
{ "nombre": "Ensaladas", "descripcion": "Ensaladas frescas y saludables" }
{ "nombre": "Sopas", "descripcion": "Sopas calientes y reconfortantes" }
{ "nombre": "Carnes", "descripcion": "Recetas con carne de res, cerdo, pollo" }
{ "nombre": "Pescados y Mariscos", "descripcion": "Recetas del mar" }
{ "nombre": "Vegetariano", "descripcion": "Recetas sin carne" }
{ "nombre": "Vegano", "descripcion": "Recetas 100% plant-based" }
```

---

## 🚀 ¡Listo para Probar!

El CRUD de categorías está completamente funcional. Prueba todos los endpoints en Postman siguiendo esta guía.

**Documentación completa:** Ver `API_CATEGORIES_DOCS.md`
