import { Router } from 'express';
// Asegúrate de que la ruta de tu controlador de warehouse sea correcta
import { getWarehouseData, getWarehouseIdData, postWarehouseData, patchWarehouseData, deleteWarehouseData  } from '../controllers/warehouse.controller.js';
// Importa tus middlewares de autenticación
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas de Warehouse

// 1. Rutas de lectura (Visualización):
// Opción A: Públicas (no necesitan login) - si es para la página web pública
router.get('/dashboard-warehouse', getWarehouseData);
router.get('/dashboard-warehouse/:id', getWarehouseIdData);

/*
// Opción B: Protegidas (necesitan login, cualquier rol) - Si solo usuarios logeados pueden ver
router.get('/warehouse', verifyToken, getAllItems);
router.get('/warehouse/:id', verifyToken, getItemById);
*/

// 2. Rutas de Escritura/Edición/Eliminación (CRUD para 'admin' y 'editor'):
// Estas rutas siempre deben ser protegidas con JWT y con los roles adecuados.
router.post('/dashboard-warehouse', verifyToken, authorizeRoles('admin', 'editor'), postWarehouseData);
router.put('/dashboard-warehouse/:id', verifyToken, authorizeRoles('admin', 'editor'), patchWarehouseData);
router.delete('/dashboard-warehouse/:id', verifyToken, authorizeRoles('admin', 'editor'), deleteWarehouseData);

export default router;