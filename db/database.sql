CREATE DATABASE IF NOT EXISTS sanjoseweb;

USE sanjoseweb;

CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Para URLs amigables (ej: "mi-gran-noticia")
    resumen TEXT, -- Breve descripción de la noticia
    contenido TEXT NOT NULL, -- Contenido completo de la noticia
    imagen_destacada VARCHAR(255), -- URL de la imagen principal de la noticia
    categoria VARCHAR(100) NOT NULL, -- Ej: 'Eventos', 'Desarrollo', 'Infraestructura', 'General'
    autor VARCHAR(100),
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado ENUM('borrador', 'publicado', 'archivado') DEFAULT 'borrador'
);

CREATE TABLE IF NOT EXISTS warehouse (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) UNIQUE NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL, -- Para URLs amigables (ej: "mi-empresa-sa")
    descripcion TEXT NOT NULL, -- Breve descripción de la empresa para publicidad
    sector VARCHAR(100), -- Ej: 'Logística', 'Manufactura', 'Tecnología'
    logotipo_url VARCHAR(255), -- URL del logo de la empresa
    sitio_web VARCHAR(255), -- URL del sitio web de la empresa
    contacto_email VARCHAR(255),
    contacto_telefono VARCHAR(20),
    direccion_bodega VARCHAR(255), -- Ubicación de la bodega dentro del parque
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    estado ENUM('activa', 'inactiva') DEFAULT 'activa' -- Si la información de la empresa está visible
);
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL, -- Aquí va el hash de la contraseña (usar bcrypt en Node.js)
    rol ENUM('admin', 'editor', 'visualizador') DEFAULT 'visualizador', -- Roles para permisos (ej: 'admin' para todo, 'editor' para noticias/empresas, 'visualizador' solo lectura)
    activo BOOLEAN DEFAULT TRUE, -- Para habilitar/deshabilitar la cuenta
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

  -- Actualizacion para verificacion 2fa
ALTER TABLE usuarios
ADD COLUMN two_factor_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN two_factor_code VARCHAR(8) NULL,
ADD COLUMN two_factor_code_expires_at DATETIME NULL;