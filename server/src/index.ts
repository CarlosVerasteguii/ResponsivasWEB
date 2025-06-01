import express from 'express';
import cors from 'cors';
import config from './config/config';
import solicitudRoutes from './routes/solicitud.routes';
import { errorHandler } from './middleware/errorHandler';
import logger from './utils/logger';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/solicitudes', solicitudRoutes);

// Error handler
app.use(errorHandler);

// Iniciar servidor
app.listen(config.PORT, () => {
    logger.info(`Servidor corriendo en http://localhost:${config.PORT}`);
}); 