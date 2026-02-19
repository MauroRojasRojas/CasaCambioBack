import { ubigeoRepository } from '../repository/ubigeo.repository.js';

export const ubigeoService = {
  // Departamentos
  async getAllDepartamentos() {
    return await ubigeoRepository.getAllDepartamentos();
  },

  // Provincias
  async getAllProvincias() {
    return await ubigeoRepository.getAllProvincias();
  },

  async getProvinciasByDepartamento(departamentoId) {
    return await ubigeoRepository.getProvinciasByDepartamento(departamentoId);
  },

  // Distritos
  async getAllDistritos() {
    return await ubigeoRepository.getAllDistritos();
  },

  async getDistritosByProvincia(provinciaId) {
    return await ubigeoRepository.getDistritosByProvincia(provinciaId);
  }
};