import { operacionesRepository } from '../repository/operaciones.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const operacionesService = {
  // ===========================
  // Crear operación
  // ===========================
  createOperacion: async (data) => {
    try {
      const operacionId = await operacionesRepository.create(data);
      return await operacionesRepository.findById(operacionId);
    } catch (error) {
      throw new AppError('Error al crear la operación', 500, 'CREATE_OPERACION_ERROR');
    }
  },

  // ===========================
  // Obtener todas las operaciones
  // ===========================
  getAllOperaciones: async () => {
    try {
      return await operacionesRepository.findAll();
    } catch (error) {
      throw new AppError('Error al obtener las operaciones', 500, 'GET_OPERACIONES_ERROR');
    }
  },

  // ===========================
  // Obtener operación por ID
  // ===========================
  getOperacionById: async (id) => {
    try {
      const operacion = await operacionesRepository.findById(id);
      if (!operacion) {
        throw new AppError('Operación no encontrada', 404, 'OPERACION_NOT_FOUND');
      }
      return operacion;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al obtener la operación', 500, 'GET_OPERACION_ERROR');
    }
  },

  // ===========================
  // Obtener operaciones por código de persona
  // ===========================
  getOperacionesByPersonaCode: async (personaCode) => {
    try {
      return await operacionesRepository.findByPersonaCode(personaCode);
    } catch (error) {
      throw new AppError('Error al obtener las operaciones de la persona', 500, 'GET_OPERACIONES_PERSONA_ERROR');
    }
  },

  // ===========================
  // Actualizar operación
  // ===========================
  updateOperacion: async (id, data) => {
    try {
      const updated = await operacionesRepository.update(id, data);
      if (!updated) {
        throw new AppError('Operación no encontrada', 404, 'OPERACION_NOT_FOUND');
      }
      return await operacionesRepository.findById(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al actualizar la operación', 500, 'UPDATE_OPERACION_ERROR');
    }
  },

  // ===========================
  // Eliminar operación
  // ===========================
  deleteOperacion: async (id) => {
    try {
      const deleted = await operacionesRepository.delete(id);
      if (!deleted) {
        throw new AppError('Operación no encontrada', 404, 'OPERACION_NOT_FOUND');
      }
      return { message: 'Operación eliminada exitosamente' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al eliminar la operación', 500, 'DELETE_OPERACION_ERROR');
    }
  }
};