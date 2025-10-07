# API de Autenticación - RecipeBox

## 📋 Endpoints Disponibles

### Base URL

```
http://localhost:8080
```

---

## 🔓 Endpoints Públicos (No requieren autenticación)

### 1. Registrar Usuario

**POST** `/auth/register`

Registra un nuevo usuario en el sistema.

**Body:**

```json
{
  "username": "juan123",
  "email": "juan@example.com",
  "password": "miPassword123",
  "foto_url": "https://example.com/foto.jpg" // opcional
}
```

**Respuesta Exitosa (201):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id_usuario": 1,
      "username": "juan123",
      "email": "juan@example.com",
      "foto_url": "https://example.com/foto.jpg",
      "creado_en": "2025-10-06T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores Posibles:**

- `400`: Campos requeridos faltantes
- `409`: Email o username ya registrado
- `400`: Error de validación (email inválido, etc.)

---

### 2. Iniciar Sesión

**POST** `/auth/login`

Autentica un usuario y retorna un token JWT.

**Body:**

```json
{
  "email": "juan@example.com",
  "password": "miPassword123"
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "usuario": {
      "id_usuario": 1,
      "username": "juan123",
      "email": "juan@example.com",
      "foto_url": "https://example.com/foto.jpg",
      "creado_en": "2025-10-06T12:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errores Posibles:**

- `400`: Email o password faltantes
- `401`: Credenciales inválidas

---

## 🔒 Endpoints Privados (Requieren autenticación)

**Header requerido:**

```
Authorization: Bearer <token>
```

### 3. Obtener Perfil

**GET** `/auth/profile`

Obtiene el perfil del usuario autenticado.

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "username": "juan123",
    "email": "juan@example.com",
    "foto_url": "https://example.com/foto.jpg",
    "creado_en": "2025-10-06T12:00:00.000Z"
  }
}
```

**Errores Posibles:**

- `401`: Token no proporcionado, inválido o expirado
- `404`: Usuario no encontrado

---

### 4. Actualizar Perfil

**PUT** `/auth/profile`

Actualiza el perfil del usuario autenticado.

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**

```json
{
  "username": "juanperez",
  "email": "juanperez@example.com",
  "foto_url": "https://example.com/nueva-foto.jpg"
}
```

**Nota:** Todos los campos son opcionales. Solo envía los que quieres actualizar.

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "id_usuario": 1,
    "username": "juanperez",
    "email": "juanperez@example.com",
    "foto_url": "https://example.com/nueva-foto.jpg",
    "creado_en": "2025-10-06T12:00:00.000Z"
  }
}
```

**Errores Posibles:**

- `401`: Token no proporcionado, inválido o expirado
- `404`: Usuario no encontrado
- `409`: Username o email ya están en uso
- `400`: Error de validación

---

### 5. Cambiar Contraseña

**PUT** `/auth/change-password`

Cambia la contraseña del usuario autenticado.

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Body:**

```json
{
  "currentPassword": "miPassword123",
  "newPassword": "nuevoPassword456"
}
```

**Respuesta Exitosa (200):**

```json
{
  "success": true,
  "message": "Contraseña actualizada exitosamente"
}
```

**Errores Posibles:**

- `401`: Token no proporcionado, inválido o expirado
- `400`: Contraseña actual incorrecta
- `400`: Nueva contraseña debe tener al menos 6 caracteres
- `404`: Usuario no encontrado

---

## 🧪 Ejemplos con cURL

### Registrar Usuario

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "email": "juan@example.com",
    "password": "miPassword123"
  }'
```

### Iniciar Sesión

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "miPassword123"
  }'
```

### Obtener Perfil (con token)

```bash
curl -X GET http://localhost:8080/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Actualizar Perfil

```bash
curl -X PUT http://localhost:8080/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juanperez"
  }'
```

### Cambiar Contraseña

```bash
curl -X PUT http://localhost:8080/auth/change-password \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "miPassword123",
    "newPassword": "nuevoPassword456"
  }'
```

---

## 🧪 Ejemplos con JavaScript (Fetch)

### Registrar Usuario

```javascript
const response = await fetch("http://localhost:8080/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "juan123",
    email: "juan@example.com",
    password: "miPassword123",
  }),
});

const data = await response.json();
console.log(data);
```

### Iniciar Sesión

```javascript
const response = await fetch("http://localhost:8080/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "juan@example.com",
    password: "miPassword123",
  }),
});

const data = await response.json();
const token = data.data.token;
// Guardar token para futuras peticiones
localStorage.setItem("token", token);
```

### Obtener Perfil (con token)

```javascript
const token = localStorage.getItem("token");

const response = await fetch("http://localhost:8080/auth/profile", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const data = await response.json();
console.log(data);
```

---

## 📝 Notas Importantes

1. **Token JWT**: El token tiene una duración de 24 horas por defecto (configurable en `.env`)
2. **Seguridad**: Todas las contraseñas se hashean con bcrypt antes de almacenarse
3. **Validaciones**:
   - Username: máximo 32 caracteres, único
   - Email: máximo 150 caracteres, único, formato válido
   - Password: mínimo 6 caracteres
4. **Headers**: Los endpoints protegidos requieren el header `Authorization: Bearer <token>`

---

## 🔧 Variables de Entorno

```env
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=24h
PORT=8080
```

---

## ⚠️ Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los datos enviados
- `401`: No autorizado (token inválido/expirado)
- `404`: Recurso no encontrado
- `409`: Conflicto (username/email ya existe)
- `500`: Error interno del servidor
