// src/modules/cuentas-internas/controller/cuentas-internas.controller.js
import { cuentasInternasService } from '../services/cuentas-internas.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const cuentasInternasController = {
  async getAll(req, res, next) {
    try {
      const data = await cuentasInternasService.getAll();
      return ApiResponse.success(res, data, 'Cuentas obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getByMoneda(req, res, next) {
    try {
      const { moneda } = req.params;
      const data = await cuentasInternasService.getByMoneda(moneda);
      return ApiResponse.success(res, data, 'Cuentas obtenidas exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const data = await cuentasInternasService.getById(id);
      return ApiResponse.success(res, data, 'Cuenta obtenida exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const { banco, tipo_cuenta, numero_cuenta, cci, moneda } = req.body;
      const insertId = await cuentasInternasService.create({ banco, tipo_cuenta, numero_cuenta, cci, moneda });
      return ApiResponse.success(res, { id: insertId }, 'Cuenta creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { banco, tipo_cuenta, numero_cuenta, cci, moneda, activa } = req.body;
      await cuentasInternasService.update(id, { banco, tipo_cuenta, numero_cuenta, cci, moneda, activa });
      return ApiResponse.success(res, null, 'Cuenta actualizada exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await cuentasInternasService.delete(id);
      return ApiResponse.success(res, null, 'Cuenta eliminada exitosamente');
    } catch (error) {
      next(error);
    }
  },

  async toggleActiva(req, res, next) {
    try {
      const { id } = req.params;
      await cuentasInternasService.toggleActiva(id);
      return ApiResponse.success(res, null, 'Visibilidad de cuenta actualizada');
    } catch (error) {
      next(error);
    }
  }
};
