import { Router } from 'express';
import { contactUsController } from '../controller/contact.controller.js';

const router = Router();

router.post('/', contactUsController.create);

export default router;