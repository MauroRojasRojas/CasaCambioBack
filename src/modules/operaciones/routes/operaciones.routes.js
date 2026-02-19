import { Router } from 'express';
import { operacionesController } from '../controller/operaciones.controller.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const router = Router();

// Rutas para operaciones
router.post('/', verifyJWT, operacionesController.create);
router.get('/', verifyJWT, operacionesController.list);
router.get('/:id', verifyJWT, operacionesController.getById);
router.put('/:id', verifyJWT, operacionesController.update);
router.delete('/:id', verifyJWT, operacionesController.delete);
router.get('/persona/:personaCode', verifyJWT, operacionesController.getByPersonaCode);

export default router;