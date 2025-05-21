import express from 'express'; 


// Importar las rutas
import indexRoutes from './routes/index.routes.js'
import homeRoutes from './routes/home.routes.js'
import newsRoutes from './routes/news.routes.js'
import warehouseRoutes from './routes/warehouse.routes.js'

// Importar la conexión a la base de datos

const app = express();

app.use(express.json());

app.use(indexRoutes);
app.use('/api', newsRoutes);
app.use('/api', homeRoutes);
app.use('/api', warehouseRoutes);


app.use((req, res, next) => {
    res.status(404).json({
        message: 'Endpoint no encontrado'})
});

export default app;