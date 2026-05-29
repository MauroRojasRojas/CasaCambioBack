import { noticiasService } from '../services/noticias.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const noticiasController = {
  async getPublic(req, res, next) {
    try {
      const data = await noticiasService.getAllPublic();
      return ApiResponse.success(res, data, 'Noticias obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getTicker(req, res, next) {
    try {
      const data = await noticiasService.getTicker();
      return ApiResponse.success(res, data, 'Noticias ticker obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await noticiasService.getAll();
      return ApiResponse.success(res, data, 'Noticias obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await noticiasService.getById(id);
      return ApiResponse.success(res, data, 'Noticia obtenida exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const {
        titulo, subtitulo, resumen, cuerpo,
        categoria, tamanio, posicion_imagen, color_acento,
        link_externo, animacion, en_ticker, activa, orden, fecha_publicacion
      } = req.body;
      const imagen_url = req.file ? `/uploads/noticias/${req.file.filename}` : null;
      const insertId = await noticiasService.create({
        titulo, subtitulo, resumen, cuerpo,
        categoria, tamanio, posicion_imagen, color_acento,
        link_externo, animacion,
        en_ticker: en_ticker !== undefined ? Number(en_ticker) : 1,
        activa: activa !== undefined ? Number(activa) : 1,
        orden: orden !== undefined ? Number(orden) : 0,
        fecha_publicacion, imagen_url
      });
      return ApiResponse.success(res, { id: insertId }, 'Noticia creada exitosamente', 201);
    } catch (error) {
      console.error('❌ Error al crear noticia:', error);
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        titulo, subtitulo, resumen, cuerpo,
        categoria, tamanio, posicion_imagen, color_acento,
        link_externo, animacion, en_ticker, activa, orden, fecha_publicacion
      } = req.body;
      const imagen_url = req.file ? `/uploads/noticias/${req.file.filename}` : req.body.imagen_url;
      await noticiasService.update(id, {
        titulo, subtitulo, resumen, cuerpo,
        categoria, tamanio, posicion_imagen, color_acento,
        link_externo, animacion,
        en_ticker: en_ticker !== undefined ? Number(en_ticker) : undefined,
        activa: activa !== undefined ? Number(activa) : undefined,
        orden: orden !== undefined ? Number(orden) : undefined,
        fecha_publicacion, imagen_url
      });
      return ApiResponse.success(res, null, 'Noticia actualizada exitosamente');
    } catch (error) {
      console.error('❌ Error al actualizar noticia:', error);
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await noticiasService.delete(id);
      return ApiResponse.success(res, null, 'Noticia eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async toggleActiva(req, res, next) {
    try {
      const { id } = req.params;
      await noticiasService.toggleActiva(id);
      return ApiResponse.success(res, null, 'Estado de noticia actualizado');
    } catch (error) {
      next(error);
    }
  }
};
