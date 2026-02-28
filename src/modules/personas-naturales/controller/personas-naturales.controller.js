import { personasNaturalesService } from '../services/personas-naturales.service.js';
import { createPersonaNaturalDto } from '../dtos/create-persona-natural.dto.js';
import { updatePersonaNaturalDto } from '../dtos/update-persona-natural.dto.js';
import { ApiResponse } from '../../../core/utils/api-response.js';

export const personasNaturalesController = {
    // Crear persona natural
    async create(req, res) {
        console.log('Entrando a create persona natural');
        try {
            
            console.log('Validando DTO');
            req.body.departamentoSeleccionado =
              req.body.departamentoSeleccionado == null ? null : String(req.body.departamentoSeleccionado);
            
            req.body.provinciaSeleccionada =
              req.body.provinciaSeleccionada == null ? null : String(req.body.provinciaSeleccionada);
            
            req.body.distritoSeleccionado =
              req.body.distritoSeleccionado == null ? null : String(req.body.distritoSeleccionado);
            const { error, value } = createPersonaNaturalDto.validate(req.body);
            if (error) {
                console.log('Error en validación:', error.details[0].message);
                return ApiResponse.error(res, error.details[0].message, 400);
            }

            console.log('Llamando al service');
            const persona = await personasNaturalesService.createPersonaNatural(value);
            console.log('Persona creada:', persona);
            ApiResponse.success(res, 'Persona natural creada exitosamente', persona, 201);
        } catch (err) {
            console.log('Error en create:', err.message);
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Obtener por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const persona = await personasNaturalesService.getPersonaNaturalById(id);
            ApiResponse.success(res, 'Persona natural obtenida', persona);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Listar todas
    async list(req, res) {
        try {
            const personas = await personasNaturalesService.getAllPersonasNaturales();
            ApiResponse.success(res, 'Personas naturales obtenidas', personas);
        } catch (err) {
            ApiResponse.error(res, err.message, 500);
        }
    },

    // Actualizar
    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updatePersonaNaturalDto.validate(req.body);
            if (error) {
                return ApiResponse.error(res, error.details[0].message, 400);
            }

            const persona = await personasNaturalesService.updatePersonaNatural(id, value);
            ApiResponse.success(res, 'Persona natural actualizada', persona);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Eliminar
    async delete(req, res) {
        try {
            const { id } = req.params;
            await personasNaturalesService.deletePersonaNatural(id);
            ApiResponse.success(res, 'Persona natural eliminada');
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    }
};