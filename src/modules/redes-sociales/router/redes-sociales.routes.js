import { Router } from 'express';
import { redesSocialesController } from '../controller/redes-sociales.controller.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const router = Router();

router.get('/public', redesSocialesController.getPublic);
router.get('/', verifyJWT, redesSocialesController.getAll);
router.post('/', verifyJWT, redesSocialesController.upsert);
router.patch('/:id/activa', verifyJWT, redesSocialesController.toggleActiva);
router.delete('/:id', verifyJWT, redesSocialesController.delete);

export default router;
