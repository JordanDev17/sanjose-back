import express from 'express';
import cors from 'cors'; // Si lo necesitas para tu frontend

// Importar las rutas existentes
import indexRoutes from './routes/index.routes.js';
import homeRoutes from './routes/home.routes.js';
import newsRoutes from './routes/news.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';

// Importar las nuevas rutas de autenticación
import authRoutes from './routes/auth.routes.js';

// Importar los middlewares de autenticación
import { verifyToken, authorizeRoles } from './middlewares/auth.middleware.js';

const app = express();

// --- Configuración de CORS ---
// 1. Define los orígenes permitidos
// Para desarrollo, puedes usar localhost:4200 (o el puerto de tu frontend de Angular)
// Para producción, deberás cambiar esto a la URL de tu frontend desplegado (ej: https://tudominiofrontend.com)
// Puedes obtener esta URL de una variable de entorno para mayor flexibilidad.
export const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:4200'; // Usa tu variable de entorno o el default para Angular

const corsOptions = {
    origin: allowedOrigins, // Solo permite solicitudes desde esta URL(es)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos (importante para el token JWT)
    credentials: true, // Permite el envío de cookies o encabezados de autorización (si los usas)
    optionsSuccessStatus: 204 // Para pre-vuelos OPTIONS (preflight requests)
};

app.use(cors(corsOptions));

// Middlewares globales
app.use(express.json()); // Para parsear JSON en el cuerpo de las solicitudes

// Rutas de autenticación
app.use('/api/auth', authRoutes); // Aquí se manejan /api/auth/login y /api/auth/register

// Rutas existentes sin protección (si es necesario)
// Asumo que indexRoutes y homeRoutes no requieren autenticación
app.use(indexRoutes);
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