import express from 'express';
import { personasJuridicasController } from '../controller/personas-juridicas.controller.js';

const router = express.Router();

// Rutas para personas jurídicas
router.post('/', personasJuridicasController.create);
router.get('/', personasJuridicasController.list);
router.get('/:id', personasJuridicasController.getById);
router.put('/:id', personasJuridicasController.update);
router.delete('/:id', personasJuridicasController.delete);

export default router;