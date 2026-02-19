import { Router } from 'express';
import { ubigeoController } from '../controller/ubigeo.controller.js';

const router = Router();

// Departamentos
router.get('/departamentos', ubigeoController.getDepartamentos);

// Provincias
router.get('/provincias', ubigeoController.getProvincias);
router.get('/provincias/:departamentoId', ubigeoController.getProvincias);

// Distritos
router.get('/distritos', ubigeoController.getDistritos);
router.get('/distritos/:provinciaId', ubigeoController.getDistritos);

export default router;