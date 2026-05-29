import { Router } from 'express';
import { bancosController } from '../controller/bancos.controller.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const router = Router();

router.get('/public', bancosController.getPublic);
router.get('/', verifyJWT, bancosController.getAll);
router.post('/', verifyJWT, bancosController.create);
router.put('/:id', verifyJWT, bancosController.update);
router.patch('/:id/visible', verifyJWT, bancosController.toggleVisible);
router.patch('/:id/disponible', verifyJWT, bancosController.toggleDisponible);
router.delete('/:id', verifyJWT, bancosController.delete);

export default router;
