import { redesSocialesService } from '../services/redes-sociales.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const redesSocialesController = {
  async getPublic(req, res, next) {
    try {
      const data = await redesSocialesService.getPublic();
      return ApiResponse.success(res, data, 'Redes sociales obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await redesSocialesService.getAll();
      return ApiResponse.success(res, data, 'Redes sociales obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async upsert(req, res, next) {
    try {
      const { red, url, activa, orden } = req.body;
      const id = await redesSocialesService.upsert({ red, url, activa, orden });
      return ApiResponse.success(res, { id }, 'Red social guardada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async toggleActiva(req, res, next) {
    try {
      const { id } = req.params;
      await redesSocialesService.toggleActiva(id);
      return ApiResponse.success(res, null, 'Estado de red social actualizado');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await redesSocialesService.delete(id);
      return ApiResponse.success(res, null, 'Red social eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  }
};
