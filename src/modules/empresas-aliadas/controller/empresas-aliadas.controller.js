// src/modules/empresas-aliadas/controller/empresas-aliadas.controller.js
import { empresasAliadasService } from '../services/empresas-aliadas.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const empresasAliadasController = {
  async getPublic(req, res, next) {
    try {
      const data = await empresasAliadasService.getAllPublic();
      return ApiResponse.success(res, data, 'Empresas aliadas obtenidas');
    } catch (error) { next(error); }
  },

  async getAll(req, res, next) {
    try {
      const data = await empresasAliadasService.getAll();
      return ApiResponse.success(res, data, 'Empresas aliadas obtenidas');
    } catch (error) { next(error); }
  },

  async getById(req, res, next) {
    try {
      const data = await empresasAliadasService.getById(req.params.id);
      return ApiResponse.success(res, data, 'Empresa obtenida');
    } catch (error) { next(error); }
  },

  async create(req, res, next) {
    try {
      const { nombre, url_web } = req.body;
      const logo_url = req.file ? `/uploads/aliadas/${req.file.filename}` : null;
      const insertId = await empresasAliadasService.create({ nombre, url_web, logo_url });
      return ApiResponse.success(res, { id: insertId }, 'Empresa creada exitosamente', 201);
    } catch (error) { next(error); }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { nombre, url_web, activa } = req.body;
      const updateData = { nombre, url_web, activa: activa !== undefined ? Number(activa) : undefined };
      if (req.file) updateData.logo_url = `/uploads/aliadas/${req.file.filename}`;
      await empresasAliadasService.update(id, updateData);
      return ApiResponse.success(res, null, 'Empresa actualizada exitosamente');
    } catch (error) { next(error); }
  },

  async delete(req, res, next) {
    try {
      await empresasAliadasService.delete(req.params.id);
      return ApiResponse.success(res, null, 'Empresa eliminada exitosamente');
    } catch (error) { next(error); }
  },

  async toggleActiva(req, res, next) {
    try {
      await empresasAliadasService.toggleActiva(req.params.id);
      return ApiResponse.success(res, null, 'Visibilidad actualizada');
    } catch (error) { next(error); }
  }
};
