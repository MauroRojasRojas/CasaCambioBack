import { ubigeoService } from '../services/ubigeo.service.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const ubigeoController = {
  // Departamentos
  async getDepartamentos(req, res) {
    try {
      const departamentos = await ubigeoService.getAllDepartamentos();
      ApiResponse.success(res, 'Departamentos obtenidos', departamentos);
    } catch (err) {
      ApiResponse.error(res, err.message, 500);
    }
  },

  // Provincias
  async getProvincias(req, res) {
    try {
      const { departamentoId } = req.params;
      let provincias;
      if (departamentoId) {
        provincias = await ubigeoService.getProvinciasByDepartamento(departamentoId);
      } else {
        provincias = await ubigeoService.getAllProvincias();
      }
      ApiResponse.success(res, 'Provincias obtenidas', provincias);
    } catch (err) {
      ApiResponse.error(res, err.message, 500);
    }
  },

  // Distritos
  async getDistritos(req, res) {
    try {
      const { provinciaId } = req.params;
      let distritos;
      if (provinciaId) {
        distritos = await ubigeoService.getDistritosByProvincia(provinciaId);
      } else {
        distritos = await ubigeoService.getAllDistritos();
      }
      ApiResponse.success(res, 'Distritos obtenidos', distritos);
    } catch (err) {
      ApiResponse.error(res, err.message, 500);
    }
  }
};