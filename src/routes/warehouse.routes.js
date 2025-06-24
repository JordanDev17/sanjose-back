// backend/routes/warehouse.routes.js
import { Router } from 'express';
// Importa las funciones del controlador de bodegas
import { getWarehouses, getWarehouseById, createWarehouse, updateWarehouse, deleteWarehouse } from '../controllers/warehouse.controller.js';
// Importa tus middlewares de autenticación
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas de Warehouse

// 1. Rutas de lectura (Visualización):
// Opción A: Públicas (no necesitan login) - si es para la página web pública
router.get('/warehouses', getWarehouses); // Nombre de ruta consistente con frontend
router.get('/warehouses/:id', getWarehouseById); // Nombre de ruta consistente con frontend

/*
// Opción B: Protegidas (necesitan login, cualquier rol) - Si solo usuarios logeados pueden ver
// router.get('/warehouses', verifyToken, getWarehouses);
// router.get('/warehouses/:id', verifyToken, getWarehouseById);
*/

// 2. Rutas de Escritura/Edición/Eliminación (CRUD para 'admin' y 'editor'):
// Estas rutas siempre deben ser protegidas con JWT y con los roles adecuados.
router.post('/warehouses', verifyToken, authorizeRoles('admin', 'editor'), createWarehouse);
router.patch('/warehouses/:id', verifyToken, authorizeRoles('admin', 'editor'), updateWarehouse);
router.delete('/warehouses/:id', verifyToken, authorizeRoles('admin', 'editor'), deleteWarehouse);

export default router;