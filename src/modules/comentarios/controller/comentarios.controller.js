// src/modules/comentarios/controller/comentarios.controller.js
import { comentariosService } from '../services/comentarios.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const comentariosController = {
  async getAll(req, res, next) {
    try {
      const data = await comentariosService.getAll();
      return ApiResponse.success(res, data, 'Comentarios obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await comentariosService.getById(id);
      return ApiResponse.success(res, data, 'Comentario obtenido exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { nombre_cliente, comentario, estrellas } = req.body;
      const foto_url = req.file ? `/uploads/comentarios/${req.file.filename}` : null;
      const insertId = await comentariosService.create({
        nombre_cliente,
        foto_url,
        comentario,
        estrellas: Number(estrellas)
      });
      return ApiResponse.success(res, { id: insertId }, 'Comentario creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre_cliente, comentario, estrellas, visible } = req.body;
      const foto_url = req.file ? `/uploads/comentarios/${req.file.filename}` : req.body.foto_url;
      await comentariosService.update(id, {
        nombre_cliente,
        foto_url,
        comentario,
        estrellas: estrellas ? Number(estrellas) : undefined,
        visible: visible !== undefined ? Number(visible) : undefined
      });
      return ApiResponse.success(res, null, 'Comentario actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await comentariosService.delete(id);
      return ApiResponse.success(res, null, 'Comentario eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async toggleVisible(req, res, next) {
    try {
      const { id } = req.params;
      await comentariosService.toggleVisible(id);
      return ApiResponse.success(res, null, 'Visibilidad actualizada');
    } catch (error) {
      next(error);
    }
  }
};
