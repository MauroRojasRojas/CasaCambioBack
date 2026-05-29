import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { noticiasController } from '../controller/noticias.controller.js';
import { AppError } from '../../../core/errors/app-error.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadDir = path.join(__dirname, '../../../../uploads/noticias');
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    return cb(new AppError('Solo se permiten imágenes (jpg, jpeg, png, webp)', 400, 'INVALID_FILE_TYPE'));
  }
});

const uploadMiddleware = (req, res, next) => {
  const uploader = upload.single('imagen');
  uploader(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('La imagen es demasiado grande (Máximo 5MB)', 400, 'FILE_TOO_LARGE'));
      }
      return next(new AppError(`Error al subir archivo: ${err.message}`, 400, 'UPLOAD_ERROR'));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

router.get('/public', noticiasController.getPublic);
router.get('/ticker', noticiasController.getTicker);

router.get('/', verifyJWT, noticiasController.getAll);
router.get('/:id', verifyJWT, noticiasController.getById);
router.post('/', verifyJWT, uploadMiddleware, noticiasController.create);
router.put('/:id', verifyJWT, uploadMiddleware, noticiasController.update);
router.delete('/:id', verifyJWT, noticiasController.delete);
router.patch('/:id/activa', verifyJWT, noticiasController.toggleActiva);

export default router;
