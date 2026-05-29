// src/modules/comentarios/router/comentarios.routes.js
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { comentariosController } from '../controller/comentarios.controller.js';
import { AppError } from '../../../core/errors/app-error.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Configuración de multer para comentarios
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // Subir 4 niveles desde src/modules/comentarios/router para llegar a la raíz (CasaCambioBack)
      const uploadDir = path.join(__dirname, '../../../../uploads/comentarios');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    } catch (error) {
      cb(new AppError('Error al crear el directorio de subida', 500, 'UPLOAD_DIR_ERROR'));
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|avif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb(new AppError('Solo se permiten imágenes (jpg, png, webp, gif, avif)', 400, 'INVALID_FILE_TYPE'));
  }
});

// Middleware para atrapar errores de Multer (como tamaño excedido) en la misma ruta
const uploadMiddleware = (req, res, next) => {
  const uploader = upload.single('foto');
  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('La imagen es demasiado grande (Máximo 5MB)', 400, 'FILE_TOO_LARGE'));
      }
      return next(new AppError(`Error al subir archivo: ${err.message}`, 400, 'UPLOAD_ERROR'));
    } else if (err) {
      return next(err); // AppError o Error no controlado
    }
    next();
  });
};

// Rutas protegidas (puedes quitar verifyJWT si no quieres auth en admin)
router.get('/', comentariosController.getAll);
router.get('/:id', comentariosController.getById);
router.post('/', uploadMiddleware, comentariosController.create);
router.put('/:id', uploadMiddleware, comentariosController.update);
router.delete('/:id', comentariosController.delete);
router.patch('/:id/visible', comentariosController.toggleVisible);

export default router;
