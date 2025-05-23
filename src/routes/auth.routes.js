import { Router } from 'express';
import { login } from '../controllers/auth.controller.js'; // Importa tus funciones de controlador

const router = Router();

router.post('/login', login);

export default router;