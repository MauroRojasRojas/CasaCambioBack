import { noticiasRepository } from '../repository/noticias.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const noticiasService = {
  async getAllPublic() {
    return await noticiasRepository.findAllPublic();
  },

  async getTicker() {
    return await noticiasRepository.findTicker();
  },

  async getAll() {
    return await noticiasRepository.findAll();
  },

  async getById(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de noticia inválido', 400, 'INVALID_ID');
    }
    const noticia = await noticiasRepository.findById(Number(id));
    if (!noticia) {
      throw new AppError('Noticia no encontrada', 404, 'NOT_FOUND');
    }
    return noticia;
  },

  async create(data) {
    if (!data.titulo || !data.categoria || !data.tamanio || !data.posicion_imagen) {
      throw new AppError('Título, categoría, tamaño y posición de imagen son requeridos', 400, 'MISSING_FIELDS');
    }
    return await noticiasRepository.create(data);
  },

  async update(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de noticia inválido', 400, 'INVALID_ID');
    }
    const exists = await noticiasRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Noticia no encontrada', 404, 'NOT_FOUND');
    }
    return await noticiasRepository.update(Number(id), data);
  },

  async delete(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de noticia inválido', 400, 'INVALID_ID');
    }
    const exists = await noticiasRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Noticia no encontrada', 404, 'NOT_FOUND');
    }
    return await noticiasRepository.delete(Number(id));
  },

  async toggleActiva(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de noticia inválido', 400, 'INVALID_ID');
    }
    const exists = await noticiasRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Noticia no encontrada', 404, 'NOT_FOUND');
    }
    return await noticiasRepository.toggleActiva(Number(id));
  }
};
