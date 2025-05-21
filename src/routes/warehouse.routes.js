import { Router } from "express";
import { getWarehouseData, postWarehouseData, patchWarehouseData, deleteWarehouseData, getWarehouseIdData } from "../controllers/warehouse.controller.js";

const router = Router();

// WAREHOUSE

// Ruta GET para obtenerlas Bodegas 
router.get('/dashboard-warehouse', getWarehouseData);
// Ruta GET para obtener una Bodega por su ID
router.get('/dashboard-warehouse/:id', getWarehouseIdData);
// Ruta POST para crear unaBodegas
router.post('/dashboard-warehouse', postWarehouseData );
// Ruta GET para obtenerlas Bodegas 
router.patch('/dashboard-warehouse/:id', patchWarehouseData );
// Ruta GET para obtenerlas Bodegas 
router.delete('/dashboard-warehouse/:id', deleteWarehouseData ); 

export default router;