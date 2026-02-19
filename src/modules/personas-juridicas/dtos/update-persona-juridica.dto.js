import Joi from 'joi';

export const updatePersonaJuridicaDto = Joi.object({
    razonSocial: Joi.string().min(2).max(255).optional(),
    correo: Joi.string().email().optional(),
    telefono: Joi.string().min(7).max(20).optional(),
    direccion: Joi.string().min(5).max(500).optional(),
    departamentoSeleccionado: Joi.string().min(2).max(100).optional(),
    provinciaSeleccionada: Joi.string().min(2).max(100).optional(),
    distritoSeleccionado: Joi.string().min(2).max(100).optional(),
    estadoExtranjero: Joi.string().min(2).max(100).optional().allow(''),
    paisSeleccionado: Joi.string().min(2).max(100).optional(),
    estado: Joi.string().valid('activo', 'inactivo').optional()
}).min(1);