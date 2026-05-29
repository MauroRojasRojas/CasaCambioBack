// src/modules/empresas-aliadas/services/empresas-aliadas.service.js
import { empresasAliadasRepository } from '../repository/empresas-aliadas.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const empresasAliadasService = {
  async getAllPublic() {
    return await empresasAliadasRepository.findAllPublic();
  },

  async getAll() {
    return await empresasAliadasRepository.findAll();
  },

  async getById(id) {
    if (!id || isNaN(Number(id))) throw new AppError('ID inválido', 400, 'INVALID_ID');
    const empresa = await empresasAliadasRepository.findById(Number(id));
    if (!empresa) throw new AppError('Empresa no encontrada', 404, 'NOT_FOUND');
    return empresa;
  },

  async create({ nombre, url_web, logo_url }) {
    if (!nombre || !nombre.trim()) throw new AppError('El nombre es obligatorio', 400, 'MISSING_FIELDS');
    if (!logo_url) throw new AppError('El logo es obligatorio', 400, 'MISSING_LOGO');
    return await empresasAliadasRepository.create({ nombre: nombre.trim(), url_web, logo_url });
  },

  async update(id, data) {
    if (!id || isNaN(Number(id))) throw new AppError('ID inválido', 400, 'INVALID_ID');
    const exists = await empresasAliadasRepository.findById(Number(id));
    if (!exists) throw new AppError('Empresa no encontrada', 404, 'NOT_FOUND');
    await empresasAliadasRepository.update(Number(id), data);
  },

  async delete(id) {
    if (!id || isNaN(Number(id))) throw new AppError('ID inválido', 400, 'INVALID_ID');
    const exists = await empresasAliadasRepository.findById(Number(id));
    if (!exists) throw new AppError('Empresa no encontrada', 404, 'NOT_FOUND');
    return await empresasAliadasRepository.delete(Number(id));
  },

  async toggleActiva(id) {
    if (!id || isNaN(Number(id))) throw new AppError('ID inválido', 400, 'INVALID_ID');
    const exists = await empresasAliadasRepository.findById(Number(id));
    if (!exists) throw new AppError('Empresa no encontrada', 404, 'NOT_FOUND');
    return await empresasAliadasRepository.toggleActiva(Number(id));
  }
};
