import { personasService } from '../services/personas.service.js';
import { createPersonaDto } from '../dtos/create-persona.dto.js';
import { updatePersonaDto } from '../dtos/update-persona.dto.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const personasController = {
    // Crear persona
    async create(req, res) {
        try {
            const { error, value } = createPersonaDto.validate(req.body);
            if (error) {
                return ApiResponse.error(res, error.details[0].message, 400);
            }

            const persona = await personasService.createPersona(value);
            ApiResponse.success(res, 'Persona creada exitosamente', persona, 201);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Obtener persona por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const persona = await personasService.getPersonaById(id);
            ApiResponse.success(res, 'Persona obtenida', persona);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Listar todas las personas
    async list(req, res) {
        try {
            const personas = await personasService.getAllPersonas();
            ApiResponse.success(res, 'Personas obtenidas', personas);
        } catch (err) {
            ApiResponse.error(res, err.message, 500);
        }
    },

    // Actualizar persona
    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updatePersonaDto.validate(req.body);
            if (error) {
                return ApiResponse.error(res, error.details[0].message, 400);
            }

            const persona = await personasService.updatePersona(id, value);
            ApiResponse.success(res, 'Persona actualizada', persona);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Eliminar persona
    async delete(req, res) {
        try {
            const { id } = req.params;
            await personasService.deletePersona(id);
            ApiResponse.success(res, 'Persona eliminada');
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    }
};