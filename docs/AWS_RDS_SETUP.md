# 🌐 Configuración de Base de Datos AWS RDS

## ✅ CREDENCIALES CONFIGURADAS

Tu backend ahora está configurado para conectarse a AWS RDS:

```
Host: practica2-semi1.c1ykk8oogf8z.us-east-2.rds.amazonaws.com
Usuario: admin
Contraseña: Practica2-Semi1
Base de datos: recipebox_db
Puerto: 3306
```

---

## 📋 PASOS PARA CONFIGURAR LA BASE DE DATOS

### Opción 1: MySQL Workbench (Recomendado)

1. **Abrir MySQL Workbench**

2. **Crear nueva conexión:**
   - Click en el icono "+" junto a "MySQL Connections"
3. **Configurar la conexión:**

   ```
   Connection Name: RecipeBox AWS RDS
   Hostname: practica2-semi1.c1ykk8oogf8z.us-east-2.rds.amazonaws.com
   Port: 3306
   Username: admin
   Password: Practica2-Semi1 (Click "Store in Keychain")
   ```

4. **Test Connection** para verificar que funciona

5. **Abrir la conexión**

6. **Ejecutar el script:**
   - Abrir el archivo: `Backend/database/recipebox_aws.sql`
   - Click en el icono del rayo ⚡ para ejecutar todo el script
   - Verificar que se crearon las 6 tablas

---

### Opción 2: Línea de Comandos

```bash
# Conectar a RDS
mysql -h practica2-semi1.c1ykk8oogf8z.us-east-2.rds.amazonaws.com -u admin -p

# Cuando pida password, ingresar: Practica2-Semi1

# Luego ejecutar el script
SOURCE /ruta/completa/a/Backend/database/recipebox_aws.sql;

# O copiar y pegar el contenido del archivo
```

---

### Opción 3: DBeaver o HeidiSQL

**DBeaver:**

1. Nueva conexión → MySQL
2. Host: `practica2-semi1.c1ykk8oogf8z.us-east-2.rds.amazonaws.com`
3. Port: `3306`
4. Database: (dejar vacío inicialmente)
5. Username: `admin`
6. Password: `Practica2-Semi1`
7. Test Connection
8. Abrir SQL Script → ejecutar `recipebox_aws.sql`

---

## 🚀 INICIAR EL BACKEND

Una vez que hayas ejecutado el script SQL:

```bash
cd Backend
npm run dev
```

Deberías ver:

```
🚀 Backend listo en http://localhost:8080
✅ Conexión a la base de datos establecida correctamente
✅ MySQL conectado con Sequelize
```

---

## 🔍 VERIFICAR LA CONEXIÓN

### 1. Health Check

```bash
curl http://localhost:8080/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "recipebox-backend",
  "ts": "2025-10-07T..."
}
```

### 2. Probar registro de usuario

```bash
# Postman o curl
POST http://localhost:8080/auth/register

{
  "username": "testuser",
  "email": "test@ejemplo.com",
  "password": "test123456"
}
```

---

## 📊 ESTRUCTURA DE LA BASE DE DATOS

El script crea 6 tablas:

### 1. **usuarios**

- id_usuario (PK)
- username (único)
- email (único)
- password_hash
- foto_url
- creado_en

### 2. **categorias**

- id_categoria (PK)
- nombre (único)
- descripcion
- creado_en

### 3. **recetas**

- id_receta (PK)
- id_usuario (FK)
- titulo
- descripcion
- ingredientes
- instrucciones
- foto_url
- tiempo_preparacion
- porciones
- es_publica
- creado_en
- actualizado_en

### 4. **receta_categorias** (Relación N:M)

- id_receta (FK)
- id_categoria (FK)
- PRIMARY KEY (id_receta, id_categoria)

### 5. **favoritos**

- id_favorito (PK)
- id_usuario (FK)
- id_receta (FK)
- creado_en
- UNIQUE (id_usuario, id_receta)

### 6. **comentarios**

- id_comentario (PK)
- id_usuario (FK)
- id_receta (FK)
- contenido
- creado_en
- actualizado_en

---

## ✨ DATOS DE PRUEBA

El script incluye 10 categorías de ejemplo:

- Postres
- Ensaladas
- Sopas
- Carnes
- Pastas
- Mariscos
- Vegetariano
- Vegano
- Desayunos
- Bebidas

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: "Can't connect to MySQL server"

**Posibles causas:**

1. **Security Group de RDS no permite tu IP**
   - Ve a AWS Console → RDS → Security Groups
   - Agregar regla de entrada: Type: MySQL/Aurora, Port: 3306, Source: Tu IP o 0.0.0.0/0

2. **RDS no es públicamente accesible**
   - Ve a AWS Console → RDS → Modify
   - Marcar "Publicly accessible"

3. **Firewall local bloqueando el puerto 3306**
   - Verificar firewall de Windows/antivirus

### Error: "Access denied for user 'admin'"

- Verificar que el password sea exactamente: `Practica2-Semi1`
- Verificar que el usuario tenga permisos en RDS

### Error: "Unknown database 'recipebox_db'"

- Ejecutar primero el script `recipebox_aws.sql` que crea la base de datos

---

## 📝 NOTAS IMPORTANTES

1. **Seguridad:** Considera cambiar las credenciales después de las pruebas iniciales
2. **Backup:** AWS RDS hace backups automáticos, pero puedes configurar snapshots adicionales
3. **Monitoreo:** Puedes ver las métricas de la BD en AWS CloudWatch
4. **Costos:** Verifica que tu instancia RDS esté en el tier gratuito si aplica

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Ejecutar el script SQL en RDS
2. ✅ Iniciar el backend con `npm run dev`
3. ✅ Probar la conexión con `/health`
4. ✅ Registrar un usuario de prueba
5. ✅ Probar todos los endpoints en Postman

---

## 📞 COMANDOS ÚTILES

### Ver tablas creadas:

```sql
USE recipebox_db;
SHOW TABLES;
```

### Ver estructura de una tabla:

```sql
DESCRIBE usuarios;
DESCRIBE recetas;
```

### Ver datos insertados:

```sql
SELECT * FROM categorias;
```

### Verificar relaciones:

```sql
SHOW CREATE TABLE recetas;
SHOW CREATE TABLE favoritos;
```

---

¡Tu backend está listo para usar AWS RDS! 🚀

**Archivo .env actualizado con las credenciales de AWS RDS**  
**Script SQL optimizado creado en:** `Backend/database/recipebox_aws.sql`
