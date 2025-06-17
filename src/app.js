import express from 'express';
import cors from 'cors'; // Si lo necesitas para tu frontend

// Rutas de la aplicación
import homeRoutes from './routes/home.routes.js';
import newsRoutes from './routes/news.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';

// Rutas de autenticación
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';

// Rutas de chatbot
import chatbotRoutes from './routes/chatbot.routes.js';

// Importar los middlewares de autenticación
import { verifyToken, authorizeRoles } from './middlewares/auth.middleware.js';

const app = express();

// --- Configuración de CORS ---
// Lee la variable de entorno FRONTEND_URL.
// Si existe, la divide por comas para obtener un array de orígenes.
// Si no existe, usa un array por defecto con 'http://localhost:4200'.
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim()) // .trim() para limpiar espacios
  : ['http://localhost:4200', 'https://sanjoseparqueindustrial.up.railway.app'];

const corsOptions = {
    // Usamos una función para el 'origin' para manejar orígenes múltiples
    // y para depurar fácilmente si un origen no está permitido.
    origin: (origin, callback) => {
        // Permite peticiones sin origen (ej. Postman, o peticiones de mismo origen en la misma red)
        if (!origin) return callback(null, true);

        // Si el origen de la petición está en nuestra lista de orígenes permitidos
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS Error: Origin '${origin}' not allowed. Configured: ${allowedOrigins.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Middlewares globales
app.use(express.json()); // Para parsear JSON en el cuerpo de las solicitudes

// Rutas para el chatbot
app.use('/api/', chatbotRoutes); // Rutas del chatbot, como /api/chatbot


// Rutas de autenticación
app.use('/api/auth', authRoutes); // Aquí se manejan /api/auth/login y /api/auth/register
app.use('/api/', usersRoutes); // Aquí se manejan /api/users y /api/users/:id
// Rutas existentes sin protección (si es necesario)

app.use('/api/', homeRoutes);

// Proteger las rutas de News
// Todas las solicitudes a /api/news y sus subrutas pasarán por verifyToken.
// Dentro de news.routes.js, usaremos authorizeRoles para acciones específicas.
app.use('/api/', newsRoutes); // Las rutas en newsRoutes ya deben tener el verifyToken aplicado por ruta.

// Proteger las rutas de Warehouse
// Todas las solicitudes a /api/warehouse y sus subrutas pasarán por verifyToken.
// Dentro de warehouse.routes.js, usaremos authorizeRoles para acciones específicas.
app.use('/api/', warehouseRoutes); // Las rutas en warehouseRoutes ya deben tener el verifyToken aplicado por ruta.


// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint no encontrado'
    });
});

export default app;