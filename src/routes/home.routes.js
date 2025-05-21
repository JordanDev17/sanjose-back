import { Router } from "express";
import { getDashboardData } from "../controllers/home.controller.js";

const router = Router();

// NEWS

// Ruta GET para obtener las noticias y bodegas
router.get('/dashboard-home', getDashboardData);


export default router;