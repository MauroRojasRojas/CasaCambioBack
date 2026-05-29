// src/modules/comentarios/services/comentarios.service.js
import { comentariosRepository } from '../repository/comentarios.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const comentariosService = {
  async getAll() {
    return await comentariosRepository.findAll();
  },

  async getById(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de comentario inválido', 400, 'INVALID_ID');
    }
    const comentario = await comentariosRepository.findById(Number(id));
    if (!comentario) {
      throw new AppError('Comentario no encontrado', 404, 'NOT_FOUND');
    }
    return comentario;
  },

  async create({ nombre_cliente, foto_url, comentario, estrellas }) {
    if (!nombre_cliente || !comentario || !estrellas) {
      throw new AppError('nombre_cliente, comentario y estrellas son requeridos', 400, 'MISSING_FIELDS');
    }
    if (estrellas < 1 || estrellas > 5) {
      throw new AppError('estrellas debe estar entre 1 y 5', 400, 'INVALID_RATING');
    }
    return await comentariosRepository.create({ nombre_cliente, foto_url, comentario, estrellas });
  },

  async update(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de comentario inválido', 400, 'INVALID_ID');
    }
    const exists = await comentariosRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Comentario no encontrado', 404, 'NOT_FOUND');
    }
    const { nombre_cliente, foto_url, comentario, estrellas, visible } = data;
    if (estrellas && (estrellas < 1 || estrellas > 5)) {
      throw new AppError('estrellas debe estar entre 1 y 5', 400, 'INVALID_RATING');
    }
    return await comentariosRepository.update(Number(id), {
      nombre_cliente: nombre_cliente ?? exists.nombre_cliente,
      foto_url: foto_url !== undefined ? foto_url : exists.foto_url,
      comentario: comentario ?? exists.comentario,
      estrellas: estrellas ?? exists.estrellas,
      visible: visible !== undefined ? visible : exists.visible
    });
  },

  async delete(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de comentario inválido', 400, 'INVALID_ID');
    }
    const exists = await comentariosRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Comentario no encontrado', 404, 'NOT_FOUND');
    }
    return await comentariosRepository.delete(Number(id));
  },

  async toggleVisible(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de comentario inválido', 400, 'INVALID_ID');
    }
    const exists = await comentariosRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Comentario no encontrado', 404, 'NOT_FOUND');
    }
    return await comentariosRepository.toggleVisible(Number(id));
  }
};
