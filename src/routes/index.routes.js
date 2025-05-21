import { Router } from "express";
import { ping } from "../controllers/index.controller.js";

const router = Router();


// Rutas para los endpoints
router.get('/ping', ping );

export default router;