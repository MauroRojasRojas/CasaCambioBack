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

      const operacion = await operacionesService.createOperacion(value, req.user);
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
  // Listar todas las operaciones (admin — datos enriquecidos)
  // ===========================
  listAdmin: async (req, res) => {
    try {
      const { desde, hasta, estados } = req.query;
      const estadosArr = estados ? estados.split(',') : undefined;
      const operaciones = await operacionesService.getAllOperacionesAdmin({ desde, hasta, estados: estadosArr });
      ApiResponse.success(res, 'Operaciones obtenidas', operaciones);
    } catch (err) {
      ApiResponse.error(res, err.message, 500);
    }
  },

  // ===========================
  // Estadísticas de operaciones
  // ===========================
  getEstadisticas: async (req, res) => {
    try {
      const { desde, hasta, agrupacion } = req.query;
      const stats = await operacionesService.getEstadisticas({ desde, hasta, agrupacion });
      ApiResponse.success(res, 'Estadísticas obtenidas', stats);
    } catch (err) {
      ApiResponse.error(res, err.message, 500);
    }
  },

  // ===========================
  // Actualizar solo el estado de una operación
  // ===========================
  updateEstado: async (req, res) => {
    try {
      const { codigoOperacion } = req.params;
      const { estado } = req.body;
      if (!estado) {
        return ApiResponse.error(res, 'El estado es requerido', 400);
      }
      const result = await operacionesService.updateOperacionEstado(codigoOperacion, estado);
      ApiResponse.success(res, result.message);
    } catch (err) {
      ApiResponse.error(res, err.message, err.status || 500);
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
  // Exportar operaciones a Excel
  // ===========================
  exportExcel: async (req, res) => {
    try {
      const { desde, hasta, estados } = req.query;
      const estadosArr = estados ? estados.split(',') : undefined;
      const buffer = await operacionesService.exportExcel({ desde, hasta, estados: estadosArr });

      const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=REPORTE_OPERACIONES_${fecha}.xlsx`);
      res.send(buffer);
    } catch (err) {
      res.status(500).json({ message: err.message || 'Error al exportar Excel' });
    }
  },

  // ===========================
  // Actualizar tasa preferencial
  // ===========================
  updateTasa: async (req, res) => {
    try {
      const { id } = req.params;
      const { tasa } = req.body;
      if (!tasa || tasa <= 0) {
        return ApiResponse.error(res, 'La tasa debe ser un número positivo', 400);
      }
      const result = await operacionesService.updateOperacionTasa(id, tasa);
      ApiResponse.success(res, 'Tasa actualizada exitosamente', result);
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