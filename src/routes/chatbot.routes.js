import { Router } from 'express';
import { getChatbotResponse } from '../controllers/chatbot.controller.js'; // Importa tus funciones de controlador

const router = Router();

router.post('/chatbot', getChatbotResponse);

export default router;