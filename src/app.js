// /app.js
import express from 'express';
import cors from 'cors';
import path from 'path'; // Para manejar rutas de archivos
import fs from 'fs';    // Para operaciones de sistema de archivos (crear directorio)

// Importar las rutas de la aplicación
import homeRoutes from './routes/home.routes.js';
import newsRoutes from './routes/news.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js'; // Importa las rutas de bodegas
import uploadRoutes from './routes/upload.routes.js'; // Importa las rutas de subida

// Rutas de autenticación
import authRoutes from './routes/auth.routes.js';
import usersRoutes from './routes/users.routes.js';

// Rutas de chatbot
import chatbotRoutes from './routes/chatbot.routes.js';

// Rutas de contacto
import contactRoutes from './routes/contact.routes.js';


// Importar los middlewares de autenticación
// Es buena práctica importarlos aquí si los usas en varias rutas, aunque se apliquen en los routers específicos.
// import { verifyToken, authorizeRoles } from './middlewares/auth.middleware.js';

const app = express();

// --- Configuración de CORS ---
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:4200', 'https://sanjose-front-production.up.railway.app'];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
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


// --- SERVIR ARCHIVOS ESTÁTICOS ---
// Definir el directorio de subidas. Se guardarán en `public/uploads`
const uploadsDir = path.resolve('public', 'uploads');

// Crear el directorio si no existe
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`Directorio de subidas creado al iniciar: ${uploadsDir}`);
}
// Esto permite que las imágenes subidas en 'public/uploads' sean accesibles públicamente
app.use('/uploads', express.static(uploadsDir));


// --- REGISTRO DE RUTAS ---

// Rutas de subida de imágenes (normalmente públicas, por eso se suelen poner antes)
app.use('/api/', uploadRoutes);

// Rutas para el chatbot
app.use('/api/', chatbotRoutes);

// Rutas de autenticación (login, register)
app.use('/api/auth', authRoutes);

// Rutas de usuarios
app.use('/api/', usersRoutes);

// Rutas existentes sin protección (si es necesario)
app.use('/api/', homeRoutes);

// Rutas de News (protegidas en news.routes.js si aplica)
app.use('/api/', newsRoutes);

// Rutas de Warehouse (protegidas en warehouse.routes.js si aplica)
app.use('/api/', warehouseRoutes);

// Rutas de contacto (protegidas en contact.routes.js si aplica)
app.use('/api', contactRoutes);


// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint no encontrado'
    });
});

export default app;