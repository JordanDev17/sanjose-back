import  app from './app.js';
import { PORT } from './config.js';

app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
    // console.log(`CORS configurado para el origen: ${allowedOrigins}`);
});




