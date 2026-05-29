// src/modules/empresas-aliadas/router/empresas-aliadas.routes.js
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { empresasAliadasController } from '../controller/empresas-aliadas.controller.js';
import { AppError } from '../../../core/errors/app-error.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// === MULTER CONFIG ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = path.join(__dirname, '../../../../uploads/aliadas');
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(new AppError('Error al crear directorio de subida', 500, 'UPLOAD_DIR_ERROR'));
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|svg/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = file.mimetype === 'image/svg+xml' || allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    return cb(new AppError('Solo se permiten imágenes (jpg, png, webp, svg)', 400, 'INVALID_FILE_TYPE'));
  }
});

const uploadMiddleware = (req, res, next) => {
  const uploader = upload.single('logo');
  uploader(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') return next(new AppError('La imagen supera el límite de 2MB', 400, 'FILE_TOO_LARGE'));
      return next(new AppError(`Error al subir archivo: ${err.message}`, 400, 'UPLOAD_ERROR'));
    } else if (err) return next(err);
    next();
  });
};

// === RUTAS ===
// Pública — sin JWT
router.get('/public', empresasAliadasController.getPublic);

// Admin — con JWT
router.get('/', verifyJWT, empresasAliadasController.getAll);
router.get('/:id', verifyJWT, empresasAliadasController.getById);
router.post('/', verifyJWT, uploadMiddleware, empresasAliadasController.create);
router.put('/:id', verifyJWT, uploadMiddleware, empresasAliadasController.update);
router.delete('/:id', verifyJWT, empresasAliadasController.delete);
router.patch('/:id/activa', verifyJWT, empresasAliadasController.toggleActiva);

export default router;
