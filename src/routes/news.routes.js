import { Router } from 'express';
// Asegúrate de que la ruta de tu controlador de noticias sea correcta
import { getNewsData, getNewsIdData, postNewsData, patchNewsData, deleteNewsData } from '../controllers/news.controller.js';
// Importa tus middlewares de autenticación
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas de Noticias

// 1. Rutas de lectura (Visualización):
// Opción A: Públicas (no necesitan login) - para la página web
router.get('/dashboard-news', getNewsData);
router.get('/dashboard-news/:id', getNewsIdData);

/*
// Opción B: Protegidas (necesitan login, cualquier rol) - Si solo usuarios logeados pueden ver
router.get('/news', verifyToken, getAllNews);
router.get('/news/:id', verifyToken, getNewsById);
*/

// 2. Rutas de Escritura/Edición/Eliminación (CRUD para 'admin' y 'editor'):
// Estas rutas siempre deben ser protegidas con JWT y con los roles adecuados.
router.post('/dashboard-news', verifyToken, authorizeRoles('admin', 'editor'), postNewsData);
router.patch('/dashboard-news/:id', verifyToken, authorizeRoles('admin', 'editor'), patchNewsData);
router.delete('/dashboard-news/:id', verifyToken, authorizeRoles('admin', 'editor'), deleteNewsData);

export default router;