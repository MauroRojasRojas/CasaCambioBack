import { bancosService } from '../services/bancos.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const bancosController = {
  async getPublic(req, res, next) {
    try {
      const data = await bancosService.getPublic();
      return ApiResponse.success(res, data, 'Bancos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getAll(req, res, next) {
    try {
      const data = await bancosService.getAll();
      return ApiResponse.success(res, data, 'Bancos obtenidos exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { nombre, logo, visible, disponible, orden } = req.body;
      const id = await bancosService.create({ nombre, logo, visible, disponible, orden });
      return ApiResponse.success(res, { id }, 'Banco creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, logo, visible, disponible, orden } = req.body;
      const data = {};
      if (nombre !== undefined) data.nombre = nombre;
      if (logo !== undefined) data.logo = logo;
      if (visible !== undefined) data.visible = visible;
      if (disponible !== undefined) data.disponible = disponible;
      if (orden !== undefined) data.orden = orden;
      await bancosService.update(id, data);
      return ApiResponse.success(res, null, 'Banco actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async toggleVisible(req, res, next) {
    try {
      const { id } = req.params;
      await bancosService.toggleVisible(id);
      return ApiResponse.success(res, null, 'Visibilidad del banco actualizada');
    } catch (error) {
      next(error);
    }
  },

  async toggleDisponible(req, res, next) {
    try {
      const { id } = req.params;
      await bancosService.toggleDisponible(id);
      return ApiResponse.success(res, null, 'Disponibilidad del banco actualizada');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await bancosService.delete(id);
      return ApiResponse.success(res, null, 'Banco eliminado exitosamente');
    } catch (error) {
      next(error);
    }
  }
};
