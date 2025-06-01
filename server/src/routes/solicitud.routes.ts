import { Router } from 'express';
import { registrarSolicitud } from '../controllers/solicitud.controller';

const router = Router();

router.post('/registrar', registrarSolicitud);

export default router; 