DROP DATABASE recipebox_db;
CREATE DATABASE recipebox_db;
USE recipebox_db;

-- Usuarios
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(32) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    foto_url VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recetas
CREATE TABLE recetas (
    id_receta INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    cuerpo TEXT,
    foto_url VARCHAR(255),
    visibilidad ENUM('public','private') DEFAULT 'public',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Categorías
CREATE TABLE categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Relación receta ↔ categorías
CREATE TABLE receta_categorias (
    id_receta INT NOT NULL,
    id_categoria INT NOT NULL,
    PRIMARY KEY (id_receta, id_categoria),
    FOREIGN KEY (id_receta) REFERENCES recetas(id_receta),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);

-- Favoritos
CREATE TABLE favoritos (
    id_favorito INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_usuario_receta (id_usuario, id_receta),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_receta) REFERENCES recetas(id_receta)
);

-- (Opcional) Comentarios
CREATE TABLE comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receta INT NOT NULL,
    contenido VARCHAR(1000) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_receta) REFERENCES recetas(id_receta)
);
