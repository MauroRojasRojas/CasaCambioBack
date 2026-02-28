import { Router } from 'express';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';
import { reclamosController } from '../controller/reclamos.controller.js';

const router = Router();

// Rutas para operaciones
router.post('/', reclamosController.create);

export default router;