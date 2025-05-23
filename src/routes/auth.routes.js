import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js'; // Importa tus funciones de controlador

const router = Router();

router.post('/login', login);
router.post('/register', register); // Opcional: para registrar nuevos usuarios, sobre todo el primero 'admin'

export default router;