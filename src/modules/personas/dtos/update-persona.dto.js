import Joi from 'joi';

// DTO para actualizar una persona
export const updatePersonaDto = Joi.object({
  nombres: Joi.string().min(2).max(255).optional(),
  apellidos: Joi.string().min(2).max(255).optional(),
  razonSocial: Joi.string().min(2).max(255).optional(),
  genero: Joi.string().valid('Masculino', 'Femenino', 'Otro').optional(),
  correo: Joi.string().email().optional(),
  telefono: Joi.string().min(7).max(20).optional(),
  direccion: Joi.string().min(5).max(500).optional(),
  departamentoSeleccionado: Joi.string().min(2).max(100).optional(),
  provinciaSeleccionada: Joi.string().min(2).max(100).optional(),
  distritoSeleccionado: Joi.string().min(2).max(100).optional(),
  estadoExtranjero: Joi.string().min(2).max(100).optional().allow(''),
  paisSeleccionado: Joi.string().min(2).max(100).optional(),
  fechaNacimiento: Joi.date().optional(),
  estado: Joi.string().valid('activo', 'inactivo').optional(),
  // Para jurídica: actualizar accionistas y representantes si se proporcionan
  accionistas: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().positive().optional(), // Para update
      personaNaturalId: Joi.number().integer().positive().required(),
      porcentaje: Joi.number().min(0).max(100).required()
    })
  ).optional(),
  representantesLegales: Joi.array().items(
    Joi.object({
      id: Joi.number().integer().positive().optional(),
      personaNaturalId: Joi.number().integer().positive().required(),
      cargo: Joi.string().min(2).max(100).required(),
      correo: Joi.string().email().optional(),
      telefono: Joi.string().min(7).max(20).optional()
    })
  ).optional()
}).min(1); // Al menos un campo debe ser proporcionado