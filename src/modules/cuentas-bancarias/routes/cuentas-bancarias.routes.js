import { Router } from 'express';
import { cuentasBancariasController } from '../controller/cuentas-bancarias.controller.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const router = Router();

// Rutas para cuentas bancarias
router.post('/', verifyJWT, cuentasBancariasController.create);
router.get('/', verifyJWT, cuentasBancariasController.list);
router.get('/:id', verifyJWT, cuentasBancariasController.getById);
router.put('/:id', verifyJWT, cuentasBancariasController.update);
router.delete('/:id', verifyJWT, cuentasBancariasController.delete);
router.get('/persona/:codigoPersona', verifyJWT, cuentasBancariasController.getByCodigoPersona);

export default router;