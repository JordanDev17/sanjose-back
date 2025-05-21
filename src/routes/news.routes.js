import { Router } from "express";
import { getNewsData, postNewsData, patchNewsData, deleteNewsData, getNewsIdData } from "../controllers/news.controller.js";

const router = Router();

// NEWS


// Ruta GET para obtener las noticias 
router.get('/dashboard-news', getNewsData);
// Ruta GET para obtener una noticia por su ID
router.get('/dashboard-news/:id', getNewsIdData);
// Ruta POST para crear una noticia
router.post('/dashboard-news', postNewsData);
// Ruta GET para obtenerlas noticias 
router.patch('/dashboard-news/:id', patchNewsData);
// Ruta GET para obtenerlas noticias 
router.delete('/dashboard-news/:id', deleteNewsData);

export default router;