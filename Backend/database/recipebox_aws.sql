-- =============================================
-- RecipeBox Database Schema for AWS RDS
-- =============================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS recipebox_db;
USE recipebox_db;

-- =============================================
-- 1. TABLA: usuarios
-- =============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    foto_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. TABLA: categorias
-- =============================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. TABLA: recetas
-- =============================================
CREATE TABLE IF NOT EXISTS recetas (
    id_receta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    ingredientes TEXT NOT NULL,
    instrucciones TEXT NOT NULL,
    foto_url VARCHAR(255),
    tiempo_preparacion INT,
    porciones INT,
    es_publica BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_titulo (titulo),
    INDEX idx_es_publica (es_publica),
    INDEX idx_creado_en (creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. TABLA: receta_categorias (Relación N:M)
-- =============================================
CREATE TABLE IF NOT EXISTS receta_categorias (
    id_receta INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_receta, id_categoria),
    FOREIGN KEY (id_receta) REFERENCES recetas(id_receta) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE,
    INDEX idx_categoria (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 5. TABLA: favoritos
-- =============================================
CREATE TABLE IF NOT EXISTS favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usuario_receta (id_usuario, id_receta),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_receta) REFERENCES recetas(id_receta) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_receta (id_receta),
    INDEX idx_creado_en (creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 6. TABLA: comentarios
-- =============================================
CREATE TABLE IF NOT EXISTS comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    contenido VARCHAR(1000) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_receta) REFERENCES recetas(id_receta) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_receta (id_receta),
    INDEX idx_creado_en (creado_en)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- DATOS DE PRUEBA (Opcional)
-- =============================================

-- Insertar categorías de ejemplo
INSERT INTO categorias (nombre, descripcion) VALUES
('Postres', 'Dulces y deliciosos postres caseros'),
('Ensaladas', 'Ensaladas frescas y saludables'),
('Sopas', 'Sopas calientes y reconfortantes'),
('Carnes', 'Platillos con carne de res, pollo y cerdo'),
('Pastas', 'Deliciosas recetas de pasta italiana'),
('Mariscos', 'Platillos con pescados y mariscos'),
('Vegetariano', 'Recetas sin carne'),
('Vegano', 'Recetas 100% vegetales'),
('Desayunos', 'Ideas para comenzar el día'),
('Bebidas', 'Bebidas refrescantes y calientes')
ON DUPLICATE KEY UPDATE nombre=nombre;

-- =============================================
-- VERIFICACIÓN
-- =============================================
SELECT 'Base de datos creada exitosamente' AS Status;
SHOW TABLES;
