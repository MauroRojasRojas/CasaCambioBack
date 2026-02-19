import { Router } from 'express';
import { personasController } from '../controller/personas.controller.js';
import { personasNaturalesController } from '../../personas-naturales/controller/personas-naturales.controller.js';
import { personasJuridicasController } from '../../personas-juridicas/controller/personas-juridicas.controller.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const router = Router();

// Rutas para personas naturales (crear sin JWT, ya que es registro)
router.post('/naturales', personasNaturalesController.create);
router.get('/naturales', verifyJWT, personasNaturalesController.list);
router.get('/naturales/:id', verifyJWT, personasNaturalesController.getById);
router.put('/naturales/:id', verifyJWT, personasNaturalesController.update);
router.delete('/naturales/:id', verifyJWT, personasNaturalesController.delete);

// Rutas para personas jurídicas (crear sin JWT)
router.post('/juridicas', personasJuridicasController.create);
router.get('/juridicas', verifyJWT, personasJuridicasController.list);
router.get('/juridicas/:id', verifyJWT, personasJuridicasController.getById);
router.put('/juridicas/:id', verifyJWT, personasJuridicasController.update);
router.delete('/juridicas/:id', verifyJWT, personasJuridicasController.delete);

// Rutas generales (crear sin JWT para compatibilidad)
router.post('/', personasController.create);
router.get('/', verifyJWT, personasController.list);
router.get('/:id', verifyJWT, personasController.getById);
router.put('/:id', verifyJWT, personasController.update);
router.delete('/:id', verifyJWT, personasController.delete);

export default router;