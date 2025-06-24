// /routes/upload.routes.js
import { Router } from 'express';
import { uploadImage, upload, handleMulterErrors } from '../controllers/upload.controller.js';
// Si tu subida de imágenes necesita autenticación, importa tus middlewares aquí:
// import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js'; // Ajusta la ruta si es necesario

const router = Router();

// Ruta POST para subir una imagen.
// 'upload.single('image')' es el middleware de Multer que procesará el archivo.
// El nombre 'image' debe coincidir con el campo `formData.append('image', file)` en tu frontend.
// Puedes agregar middlewares de autenticación y autorización aquí si es necesario:
// router.post('/upload', verifyToken, authorizeRoles(['admin', 'editor']), upload.single('image'), uploadImage);
router.post('/upload', upload.single('image'), uploadImage);

// Añadir el middleware de manejo de errores de Multer para esta ruta
router.use(handleMulterErrors);


export default router;
