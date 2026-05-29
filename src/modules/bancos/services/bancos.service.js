import { bancosRepository } from '../repository/bancos.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const bancosService = {
  async getPublic() {
    return await bancosRepository.findAllPublic();
  },

  async getAll() {
    return await bancosRepository.findAll();
  },

  async getById(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const banco = await bancosRepository.findById(Number(id));
    if (!banco) {
      throw new AppError('Banco no encontrado', 404, 'NOT_FOUND');
    }
    return banco;
  },

  async create({ nombre, logo, visible, disponible, orden }) {
    if (!nombre || !nombre.trim()) {
      throw new AppError('El nombre del banco es obligatorio', 400, 'INVALID_NAME');
    }
    if (!logo || !logo.trim()) {
      throw new AppError('El logo es obligatorio', 400, 'INVALID_LOGO');
    }
    const id = await bancosRepository.create({
      nombre: nombre.trim(),
      logo: logo.trim(),
      visible: visible ?? 1,
      disponible: disponible ?? 1,
      orden: orden ?? 0
    });
    return id;
  },

  async update(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const exists = await bancosRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Banco no encontrado', 404, 'NOT_FOUND');
    }
    if (data.nombre !== undefined && !data.nombre.trim()) {
      throw new AppError('El nombre del banco no puede estar vacío', 400, 'INVALID_NAME');
    }
    if (data.logo !== undefined && !data.logo.trim()) {
      throw new AppError('El logo no puede estar vacío', 400, 'INVALID_LOGO');
    }
    return await bancosRepository.update(Number(id), data);
  },

  async toggleVisible(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const exists = await bancosRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Banco no encontrado', 404, 'NOT_FOUND');
    }
    return await bancosRepository.toggleVisible(Number(id));
  },

  async toggleDisponible(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const exists = await bancosRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Banco no encontrado', 404, 'NOT_FOUND');
    }
    return await bancosRepository.toggleDisponible(Number(id));
  },

  async delete(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const exists = await bancosRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Banco no encontrado', 404, 'NOT_FOUND');
    }
    return await bancosRepository.delete(Number(id));
  }
};
