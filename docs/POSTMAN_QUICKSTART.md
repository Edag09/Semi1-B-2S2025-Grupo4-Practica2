# 🚀 Guía Rápida - Postman RecipeBox API

## 📋 SETUP INICIAL

### 1. Iniciar el servidor

```bash
cd Backend
npm run dev
```

### 2. Crear variable de entorno en Postman

1. Click en el icono del ojo (⚙️) arriba a la derecha
2. Click en **"Add"** (Environments)
3. Nombre: `RecipeBox Local`
4. Variables:
   - `base_url` = `http://localhost:8080`
   - `token` = (se llenará automáticamente después del login)

---

## 🧪 PRUEBA RÁPIDA (5 MINUTOS)

### PASO 1: Registrar Usuario

**POST** `{{base_url}}/auth/register`

**Body (JSON):**

```json
{
  "username": "testuser",
  "email": "test@ejemplo.com",
  "password": "test123456"
}
```

**✅ Resultado esperado:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id_usuario": 1,
    "username": "testuser",
    "email": "test@ejemplo.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**📝 IMPORTANTE:** Copia el `token` de la respuesta.

---

### PASO 2: Configurar el Token

1. Ve a **Authorization** en la pestaña del request
2. Selecciona **Bearer Token**
3. Pega el token copiado

**O mejor aún:** Guarda el token en la variable de entorno:

1. Click derecho en el valor del token en la respuesta
2. **Set: RecipeBox Local > token**

Ahora en todos los requests usa: `{{token}}` en Authorization.

---

### PASO 3: Crear Categoría

**POST** `{{base_url}}/categorias`

**Authorization:** Bearer Token `{{token}}`

**Body (JSON):**

```json
{
  "nombre": "Postres",
  "descripcion": "Dulces y deliciosos postres caseros"
}
```

**✅ Resultado esperado:**

```json
{
  "success": true,
  "message": "Categoría creada exitosamente",
  "data": {
    "id_categoria": 1,
    "nombre": "Postres",
    "descripcion": "Dulces y deliciosos postres caseros"
  }
}
```

---

### PASO 4: Crear Receta

**POST** `{{base_url}}/recetas`

**Authorization:** Bearer Token `{{token}}`

**Body (JSON):**

```json
{
  "titulo": "Pastel de Chocolate",
  "descripcion": "Un delicioso pastel de chocolate casero",
  "ingredientes": "Harina (2 tazas), Azúcar (1.5 tazas), Cacao en polvo (3/4 taza), Huevos (3), Mantequilla (1/2 taza), Leche (1 taza)",
  "instrucciones": "1. Precalentar el horno a 180°C. 2. Mezclar ingredientes secos. 3. Agregar huevos y líquidos. 4. Hornear por 40 minutos.",
  "foto_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  "tiempo_preparacion": 60,
  "porciones": 8,
  "es_publica": true,
  "categorias": [1]
}
```

**✅ Resultado esperado:**

```json
{
  "success": true,
  "message": "Receta creada exitosamente",
  "data": {
    "id_receta": 1,
    "titulo": "Pastel de Chocolate",
    "categorias": [
      {
        "id_categoria": 1,
        "nombre": "Postres"
      }
    ]
  }
}
```

---

### PASO 5: Agregar a Favoritos

**POST** `{{base_url}}/favoritos/1`

**Authorization:** Bearer Token `{{token}}`

**Body:** (vacío)

**✅ Resultado esperado:**

```json
{
  "success": true,
  "message": "Receta agregada a favoritos",
  "data": {
    "id_favorito": 1,
    "id_usuario": 1,
    "id_receta": 1
  }
}
```

---

### PASO 6: Comentar en Receta

**POST** `{{base_url}}/comentarios/1`

**Authorization:** Bearer Token `{{token}}`

**Body (JSON):**

```json
{
  "contenido": "¡Excelente receta! Me quedó delicioso 😋"
}
```

**✅ Resultado esperado:**

```json
{
  "success": true,
  "message": "Comentario creado exitosamente",
  "data": {
    "id_comentario": 1,
    "contenido": "¡Excelente receta! Me quedó delicioso 😋",
    "usuario": {
      "username": "testuser"
    }
  }
}
```

---

### PASO 7: Ver Todo

#### Ver mis recetas:

**GET** `{{base_url}}/recetas/mis-recetas`

#### Ver mis favoritos:

**GET** `{{base_url}}/favoritos`

#### Ver comentarios de la receta:

**GET** `{{base_url}}/comentarios/receta/1`

#### Ver mi perfil:

**GET** `{{base_url}}/auth/perfil`

---

## 📦 COLECCIÓN POSTMAN COMPLETA

### Organización de carpetas recomendada:

```
RecipeBox API/
├── 🔐 Auth/
│   ├── Register
│   ├── Login
│   ├── Get Profile
│   ├── Update Profile
│   └── Change Password
│
├── 📂 Categories/
│   ├── Create Category
│   ├── Get All Categories
│   ├── Get Category by ID
│   ├── Get Category with Recipes
│   ├── Update Category
│   ├── Delete Category
│   └── Get Category Stats
│
├── 🍽️ Recipes/
│   ├── Create Recipe
│   ├── Get All Recipes
│   ├── Get Recipe by ID
│   ├── Get My Recipes
│   ├── Get Popular Recipes
│   ├── Update Recipe
│   └── Delete Recipe
│
├── ⭐ Favorites/
│   ├── Add to Favorites
│   ├── Get My Favorites
│   ├── Check if Favorite
│   ├── Remove from Favorites
│   └── Get Favorites Stats
│
└── 💬 Comments/
    ├── Create Comment
    ├── Get Recipe Comments
    ├── Get My Comments
    ├── Update Comment
    └── Delete Comment
```

---

## 🎯 ATAJOS POSTMAN

### Variables de entorno útiles:

```
{{base_url}}    → http://localhost:8080
{{token}}       → (tu JWT token)
```

### Uso en requests:

- URL: `{{base_url}}/recetas`
- Authorization: Bearer Token `{{token}}`

---

## 🔥 PRUEBAS AVANZADAS

### 1. Filtrar recetas por categoría:

```
GET {{base_url}}/recetas?categoriaId=1
```

### 2. Buscar recetas:

```
GET {{base_url}}/recetas?search=chocolate
```

### 3. Solo recetas públicas:

```
GET {{base_url}}/recetas?esPublica=true
```

### 4. Paginación:

```
GET {{base_url}}/recetas?page=1&limit=5
```

### 5. Combinar filtros:

```
GET {{base_url}}/recetas?search=pastel&categoriaId=1&page=1&limit=10
```

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### ❌ Error 401: Unauthorized

**Causa:** Token no válido o expirado
**Solución:**

1. Hacer login nuevamente
2. Copiar el nuevo token
3. Actualizar en Authorization

### ❌ Error 403: Forbidden

**Causa:** Intentando editar/eliminar recurso de otro usuario
**Solución:** Solo puedes modificar tus propios recursos

### ❌ Error 404: Not Found

**Causa:** El ID no existe
**Solución:** Verificar que el ID sea correcto (ej: `/recetas/1`)

### ❌ Error 400: Bad Request

**Causa:** Datos faltantes o inválidos
**Solución:** Revisar el body del request según la documentación

---

## 📊 SCRIPTS POSTMAN

### Pre-request Script (para login automático):

```javascript
// Guardar token automáticamente después del login
pm.test("Save token", function () {
  var jsonData = pm.response.json();
  if (jsonData.data && jsonData.data.token) {
    pm.environment.set("token", jsonData.data.token);
  }
});
```

### Test Script (validación de respuesta):

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has success field", function () {
  var jsonData = pm.response.json();
  pm.expect(jsonData).to.have.property("success");
  pm.expect(jsonData.success).to.be.true;
});
```

---

## 🎨 TIPS PARA POSTMAN

1. **Usa Collections** para organizar todos los endpoints
2. **Usa Environments** para diferentes entornos (local, dev, prod)
3. **Usa Variables** para reutilizar valores (base_url, token)
4. **Usa Tests** para validar respuestas automáticamente
5. **Usa Pre-request Scripts** para automatizar tareas

---

## ✅ CHECKLIST DE PRUEBAS

### Autenticación

- [ ] Registrar usuario nuevo
- [ ] Login con credenciales correctas
- [ ] Login con credenciales incorrectas (debe fallar)
- [ ] Ver perfil autenticado
- [ ] Actualizar perfil
- [ ] Cambiar contraseña

### Categorías

- [ ] Crear categoría
- [ ] Listar todas las categorías
- [ ] Buscar categoría por nombre
- [ ] Obtener categoría por ID
- [ ] Actualizar categoría
- [ ] Eliminar categoría

### Recetas

- [ ] Crear receta pública con categorías
- [ ] Crear receta privada
- [ ] Listar todas las recetas públicas
- [ ] Filtrar por categoría
- [ ] Buscar por texto
- [ ] Ver recetas populares
- [ ] Actualizar mi receta
- [ ] Intentar actualizar receta de otro usuario (debe fallar)
- [ ] Eliminar mi receta

### Favoritos

- [ ] Agregar receta a favoritos
- [ ] Ver mis favoritos
- [ ] Verificar si receta es favorito
- [ ] Ver estadísticas de favoritos
- [ ] Quitar de favoritos

### Comentarios

- [ ] Crear comentario en receta
- [ ] Ver comentarios de una receta
- [ ] Ver mis comentarios
- [ ] Actualizar mi comentario
- [ ] Intentar actualizar comentario de otro usuario (debe fallar)
- [ ] Eliminar mi comentario

---

## 🚀 ¡LISTO PARA PROBAR!

1. ✅ Inicia el servidor: `npm run dev`
2. ✅ Abre Postman
3. ✅ Sigue los pasos 1-7 de la Prueba Rápida
4. ✅ Explora todos los endpoints de la API

**¡Tu API está 100% funcional! 🎉**

---

Para documentación completa ver: **API_COMPLETE_DOCS.md**
