// backend/controllers/upload.controller.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Definir el directorio de subidas. Se guardarán en `src/public/uploads`
// path.resolve() asegura una ruta absoluta independiente del directorio de ejecución.
const uploadsDir = path.resolve('public', 'uploads');

// Crear el directorio si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Directorio de subidas creado: ${uploadsDir}`);
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Directorio donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    // Generar un nombre de archivo único para evitar colisiones
    // Se usa Date.now() y un número aleatorio, manteniendo la extensión original.
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Aceptar el archivo
  } else {
    // Si el archivo no es una imagen, rechazarlo con un error.
    // El frontend debe manejar este error (status 400).
    const error = new Error('Solo se permiten archivos de imagen!');
    error.status = 400; // Asignar un status para manejarlo mejor
    cb(error, false);
  }
};

// Instancia de Multer configurada
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de 5MB por archivo (5 * 1024 * 1024 bytes)
});

// Controlador principal para la subida de una sola imagen
export const uploadImage = (req, res) => {
  // Multer ya ha procesado la subida en este punto.
  // Si no hay req.file, significa que no se subió ningún archivo o el filtro lo rechazó.
  if (!req.file) {
    // El error del fileFilter debería propagarse aquí si ocurre.
    // Si llegamos aquí y no hay file, es un error general de subida.
    return res.status(400).json({ message: 'No se ha subido ningún archivo o el formato no es compatible. Asegúrese de subir un archivo de imagen válido.' });
  }

  // Construye la URL completa de la imagen subida.
  // req.protocol: 'http' o 'https'
  // req.get('host'): 'localhost:3000' o tu dominio
  // req.file.filename: el nombre único que Multer le dio al archivo
  const imageUrl = `https://${req.get('host')}/uploads/${req.file.filename}`;
  console.log(`Imagen subida exitosamente: ${imageUrl}`);
  res.status(200).json({ imageUrl: imageUrl });
};

// Middleware para manejar errores específicos de Multer (opcional, pero útil)
export const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Un error específico de Multer
    console.error('Multer Error:', err.message);
    return res.status(400).json({ message: `Error al subir el archivo: ${err.message}` });
  } else if (err) {
    // Otros errores (como los del fileFilter o cualquier error lanzado manualmente)
    console.error('File Upload Error:', err.message);
    const statusCode = err.status || 500; // Si le asignamos un status en fileFilter
    return res.status(statusCode).json({ message: err.message });
  }
  next(); // Pasa a la siguiente middleware si no hay error de Multer
};

// Exporta la instancia de Multer para usarla en las rutas como middleware
export { upload };
