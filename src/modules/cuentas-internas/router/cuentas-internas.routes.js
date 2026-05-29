// src/modules/cuentas-internas/router/cuentas-internas.routes.js
import { Router } from 'express';
import { cuentasInternasController } from '../controller/cuentas-internas.controller.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const router = Router();

// Públicas o accesibles para el cliente en el flujo de operación
router.get('/moneda/:moneda', cuentasInternasController.getByMoneda);

// Privadas (Admin)
router.get('/', verifyJWT, cuentasInternasController.getAll);
router.get('/:id', verifyJWT, cuentasInternasController.getById);
router.post('/', verifyJWT, cuentasInternasController.create);
router.put('/:id', verifyJWT, cuentasInternasController.update);
router.delete('/:id', verifyJWT, cuentasInternasController.delete);
router.patch('/:id/activa', verifyJWT, cuentasInternasController.toggleActiva);

export default router;
