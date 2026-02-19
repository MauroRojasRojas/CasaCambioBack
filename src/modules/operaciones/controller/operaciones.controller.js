import { operacionesService } from '../services/operaciones.service.js';
import { createOperacionDto } from '../dtos/create-operacion.dto.js';
import { updateOperacionDto } from '../dtos/update-operacion.dto.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const operacionesController = {
  // ===========================
  // Crear operación
  // ===========================
  create: async (req, res) => {
    try {
      const { error, value } = createOperacionDto.validate(req.body);
      if (error) {
        return ApiResponse.error(res, error.details[0].message, 400);
      }

      const operacion = await operacionesService.createOperacion(value);
      ApiResponse.success(res, 'Operación creada exitosamente', operacion, 201);
    } catch (err) {
      ApiResponse.error(res, err.message, err.status || 500);
    }
  },

  // ===========================
  // Listar todas las operaciones
  // ===========================
  list: async (req, res) => {
    try {
      const operaciones = await operacionesService.getAllOperaciones();
      ApiResponse.success(res, 'Operaciones obtenidas', operaciones);
    } catch (err) {
      ApiResponse.error(res, err.message, 500);
    }
  },

  // ===========================
  // Obtener operación por ID
  // ===========================
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const operacion = await operacionesService.getOperacionById(id);
      ApiResponse.success(res, 'Operación obtenida', operacion);
    } catch (err) {
      ApiResponse.error(res, err.message, err.status || 500);
    }
  },

  // ===========================
  // Obtener operaciones por código de persona
  // ===========================
  getByPersonaCode: async (req, res) => {
    try {
      const { personaCode } = req.params;
      const operaciones = await operacionesService.getOperacionesByPersonaCode(personaCode);
      ApiResponse.success(res, 'Operaciones obtenidas', operaciones);
    } catch (err) {
      ApiResponse.error(res, err.message, 500);
    }
  },

  // ===========================
  // Actualizar operación
  // ===========================
  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { error, value } = updateOperacionDto.validate(req.body);
      if (error) {
        return ApiResponse.error(res, error.details[0].message, 400);
      }

      const operacion = await operacionesService.updateOperacion(id, value);
      ApiResponse.success(res, 'Operación actualizada', operacion);
    } catch (err) {
      ApiResponse.error(res, err.message, err.status || 500);
    }
  },

  // ===========================
  // Eliminar operación
  // ===========================
  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await operacionesService.deleteOperacion(id);
      ApiResponse.success(res, result.message);
    } catch (err) {
      ApiResponse.error(res, err.message, err.status || 500);
    }
  }
};