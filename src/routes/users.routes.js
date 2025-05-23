import { Router } from 'express';
// Asegúrate de que la ruta de tu controlador de warehouse sea correcta
import { getUsersData, getUsersIdData, postUsersData, patchUsersData, deleteUsersData  } from '../controllers/users.controller.js';
// Importa tus middlewares de autenticación
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas de Users

// 1. Rutas de lectura (Visualización):
// Opción A: Públicas (no necesitan login) - si es para la página web pública
// router.get('/users-admin', getWarehouseData);
// router.get('/users-admin/:id', getWarehouseIdData);


// Opción B: Protegidas (necesitan login, rol admin) - Si solo administrador puede ver los datos
router.get('/users-admin', verifyToken,authorizeRoles('admin'), getUsersData);
router.get('/users-admin/:id', verifyToken,authorizeRoles('admin'), getUsersIdData);


// 2. Rutas de Escritura/Edición/Eliminación (CRUD para 'admin' y 'editor'):
// Estas rutas siempre deben ser protegidas con JWT y con los roles adecuados.
router.post('/users-admin', verifyToken, authorizeRoles('admin'), postUsersData);
router.patch('/users-admin/:id', verifyToken, authorizeRoles('admin'), patchUsersData);
router.delete('/users-admin/:id', verifyToken, authorizeRoles('admin'), deleteUsersData);

export default router;