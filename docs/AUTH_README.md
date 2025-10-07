# 🔐 Sistema de Autenticación - RecipeBox Backend

Sistema completo de autenticación implementado con **Sequelize ORM**, **JWT** y **bcrypt**.

## 🎯 Características

✅ **Registro de usuarios** con validación
✅ **Login** con JWT tokens
✅ **Autenticación** mediante middleware
✅ **Gestión de perfil** (ver y actualizar)
✅ **Cambio de contraseña** seguro
✅ **Encriptación** de contraseñas con bcrypt
✅ **Tokens JWT** con expiración configurable
✅ **Validaciones** automáticas con Sequelize
✅ **Manejo de errores** centralizado

---

## 📁 Estructura de Archivos

```
Backend/
├── controllers/
│   └── auth.controller.js       # Controladores de autenticación
├── services/
│   └── auth.service.js          # Lógica de negocio
├── routes/
│   └── auth.routes.js           # Rutas de autenticación
├── middlewares/
│   ├── authJwt.js              # Middleware de verificación JWT
│   └── error.js                # Manejo global de errores
├── utils/
│   ├── jwt.js                  # Utilidades para JWT
│   └── passwords.js            # Utilidades para contraseñas
├── models/
│   ├── usuario.model.js        # Modelo de Usuario (Sequelize)
│   └── index.js                # Configuración de modelos
├── config/
│   └── db.js                   # Configuración de BD
├── .env                        # Variables de entorno
├── API_AUTH_DOCS.md           # Documentación de la API
└── test-auth.js               # Script de pruebas automatizado
```

---

## 🚀 Endpoints Disponibles

### Públicos (No requieren autenticación)

- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión

### Privados (Requieren token JWT)

- `GET /auth/profile` - Obtener perfil del usuario
- `PUT /auth/profile` - Actualizar perfil
- `PUT /auth/change-password` - Cambiar contraseña

---

## 📋 Requisitos Previos

1. **Base de datos MySQL** configurada y corriendo
2. **Variables de entorno** configuradas en `.env`:

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASS=admin
DB_NAME=recipebox_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRES_IN=24h

# Servidor
PORT=8080
NODE_ENV=development
```

---

## 🔧 Instalación

1. **Instalar dependencias:**

```bash
cd Backend
npm install
```

2. **Crear la base de datos:**

```bash
mysql -u root -padmin < database/recipebox.sql
```

3. **Iniciar el servidor:**

```bash
npm run dev
```

El servidor estará corriendo en `http://localhost:8080`

---

## 🧪 Probar el Sistema

### Opción 1: Script Automatizado

Ejecuta el script de pruebas que verifica todos los endpoints:

```bash
node test-auth.js
```

Este script probará:

- ✓ Registro de usuario
- ✓ Inicio de sesión
- ✓ Login con credenciales inválidas
- ✓ Obtener perfil
- ✓ Actualizar perfil
- ✓ Cambiar contraseña
- ✓ Acceso sin token
- ✓ Token inválido

### Opción 2: Thunder Client / Postman

Importa la colección de Thunder Client:

```
thunder-tests/thunderclient-auth.json
```

### Opción 3: cURL Manual

**Registrar usuario:**

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Iniciar sesión:**

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Obtener perfil (reemplaza TOKEN):**

```bash
curl -X GET http://localhost:8080/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔐 Seguridad

### Contraseñas

- Hasheadas con **bcrypt** (10 rounds)
- Nunca se devuelven en las respuestas
- Mínimo 6 caracteres requeridos

### Tokens JWT

- Firmados con clave secreta
- Expiración configurable (24h por default)
- Incluyen: `id_usuario`, `username`, `email`

### Validaciones

- Email debe ser válido
- Username único (máx. 32 caracteres)
- Email único (máx. 150 caracteres)
- Campos requeridos validados

### Middleware de Autenticación

```javascript
// Proteger una ruta
router.get("/ruta-protegida", verifyJWT, controller.metodo);

// Autenticación opcional
router.get("/ruta-opcional", verifyJWTOptional, controller.metodo);
```

---

## 📖 Ejemplos de Uso

### En JavaScript (Frontend)

```javascript
// 1. Registrar usuario
const register = async () => {
  const response = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "juan123",
      email: "juan@example.com",
      password: "password123",
    }),
  });
  const data = await response.json();
  const token = data.data.token;
  localStorage.setItem("token", token);
};

// 2. Login
const login = async () => {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "juan@example.com",
      password: "password123",
    }),
  });
  const data = await response.json();
  const token = data.data.token;
  localStorage.setItem("token", token);
};

// 3. Hacer peticiones autenticadas
const getProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8080/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  console.log(data);
};
```

---

## 🛠️ Personalización

### Cambiar duración del token

En `.env`:

```env
JWT_EXPIRES_IN=7d    # 7 días
JWT_EXPIRES_IN=2h    # 2 horas
JWT_EXPIRES_IN=30m   # 30 minutos
```

### Agregar campos al usuario

1. Modifica `models/usuario.model.js`
2. Actualiza `services/auth.service.js`
3. Ejecuta migración o `sequelize.sync()`

### Agregar más validaciones

En `models/usuario.model.js`:

```javascript
username: {
  type: DataTypes.STRING(32),
  validate: {
    isAlphanumeric: true,  // Solo letras y números
    notContains: '@'       // No permitir @
  }
}
```

---

## 🐛 Solución de Problemas

### Error: "Token expirado"

- El token JWT expiró
- Solicita un nuevo login

### Error: "Usuario no encontrado"

- El usuario fue eliminado de la BD
- Verificar que la BD esté corriendo

### Error: "Email ya registrado"

- El email ya existe en la BD
- Usar otro email o hacer login

### Error de conexión a BD

- Verificar que MySQL esté corriendo
- Revisar credenciales en `.env`
- Confirmar que la BD existe

---

## 📚 Documentación Adicional

- [Documentación completa de la API](./API_AUTH_DOCS.md)
- [Documentación de Modelos](./models/README.md)
- [Ejemplos de uso de modelos](./models/ejemplos-uso.js)

---

## ✅ Checklist de Implementación

- [x] Modelos con Sequelize
- [x] Utilidades para JWT
- [x] Utilidades para contraseñas (bcrypt)
- [x] Servicio de autenticación
- [x] Controladores
- [x] Rutas
- [x] Middleware de autenticación
- [x] Middleware de manejo de errores
- [x] Validaciones
- [x] Documentación de API
- [x] Script de pruebas
- [x] Colección Thunder Client

---

## 🎓 Próximos Pasos

1. ✅ Sistema de autenticación implementado
2. 🔄 Implementar CRUD de recetas
3. 🔄 Implementar sistema de favoritos
4. 🔄 Implementar comentarios
5. 🔄 Implementar categorías
6. 🔄 Agregar validaciones de roles (admin, user)
7. 🔄 Implementar refresh tokens
8. 🔄 Agregar rate limiting
9. 🔄 Implementar upload de imágenes

---

## 👥 Uso en Otros Módulos

Para usar el sistema de autenticación en otros controladores:

```javascript
// En tus rutas
const { verifyJWT } = require("../middlewares/authJwt");

router.post("/recetas", verifyJWT, recetasController.crear);
//                      ↑ Esto protege la ruta

// En tu controlador, accede al usuario autenticado:
const crear = async (req, res) => {
  const userId = req.user.id_usuario; // ← Usuario autenticado
  const username = req.user.username;
  // ...tu lógica
};
```

---

## 📞 Soporte

Para dudas o problemas:

1. Revisa la [documentación de la API](./API_AUTH_DOCS.md)
2. Ejecuta el script de pruebas: `node test-auth.js`
3. Verifica los logs del servidor

---

¡Sistema de autenticación completo y listo para usar! 🎉
