import { personasJuridicasService } from '../services/personas-juridicas.service.js';
import { createPersonaJuridicaDto } from '../dtos/create-persona-juridica.dto.js';
import { updatePersonaJuridicaDto } from '../dtos/update-persona-juridica.dto.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const personasJuridicasController = {
    // Crear persona jurídica
async create(req, res) {
  try {
    req.body.departamentoSeleccionado =
      req.body.departamentoSeleccionado == null ? null : String(req.body.departamentoSeleccionado);

    req.body.provinciaSeleccionada =
      req.body.provinciaSeleccionada == null ? null : String(req.body.provinciaSeleccionada);

    req.body.distritoSeleccionado =
      req.body.distritoSeleccionado == null ? null : String(req.body.distritoSeleccionado);

    if (req.body.accionistas?.length > 0) {
      req.body.accionistas = req.body.accionistas.map((a) => {
        return {
          ...a,
          departamentoSeleccionado:
            a.departamentoSeleccionado == null ? null : String(a.departamentoSeleccionado),
          provinciaSeleccionada:
            a.provinciaSeleccionada == null ? null : String(a.provinciaSeleccionada),
          distritoSeleccionado:
            a.distritoSeleccionado == null ? null : String(a.distritoSeleccionado),
        };
      });
    }

    if (req.body.representantesLegales?.length > 0) {
      req.body.representantesLegales = req.body.representantesLegales.map((a) => {
        return {
          ...a,
          departamentoSeleccionado:
            a.departamentoSeleccionado == null ? null : String(a.departamentoSeleccionado),
          provinciaSeleccionada:
            a.provinciaSeleccionada == null ? null : String(a.provinciaSeleccionada),
          distritoSeleccionado:
            a.distritoSeleccionado == null ? null : String(a.distritoSeleccionado),
        };
      });
    }

    const { error, value } = createPersonaJuridicaDto.validate(req.body);

    if (error) {
      return ApiResponse.error(res, error.details[0].message, 400);
    }

    const persona = await personasJuridicasService.createPersonaJuridica(value);
    return ApiResponse.success(res, 'Persona jurídica creada exitosamente', persona, 201);
  } catch (err) {
    return ApiResponse.error(res, err.message, err.status || 500);
  }
},

    // Obtener por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const persona = await personasJuridicasService.getPersonaJuridicaById(id);
            ApiResponse.success(res, 'Persona jurídica obtenida', persona);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Listar todas
    async list(req, res) {
        try {
            const personas = await personasJuridicasService.getAllPersonasJuridicas();
            ApiResponse.success(res, 'Personas jurídicas obtenidas', personas);
        } catch (err) {
            ApiResponse.error(res, err.message, 500);
        }
    },

    // Actualizar
    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updatePersonaJuridicaDto.validate(req.body);
            if (error) {
                return ApiResponse.error(res, error.details[0].message, 400);
            }

            const persona = await personasJuridicasService.updatePersonaJuridica(id, value);
            ApiResponse.success(res, 'Persona jurídica actualizada', persona);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Eliminar
    async delete(req, res) {
        try {
            const { id } = req.params;
            await personasJuridicasService.deletePersonaJuridica(id);
            ApiResponse.success(res, 'Persona jurídica eliminada');
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    }
};