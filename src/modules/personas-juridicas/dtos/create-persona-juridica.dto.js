import Joi from 'joi';

const personaNaturalSchema = Joi.object({
    tipoDocumento: Joi.string().valid('DNI', 'CE').required(),
    numeroDocumento: Joi.string().min(8).max(20).required(),
    nombres: Joi.string().min(2).max(255).required(),
    apellidos: Joi.string().min(2).max(255).required(),
    fechaNacimiento: Joi.string().required(), // Asumiendo formato YYYY-MM-DD
    genero: Joi.string().valid('M', 'F').required(),
    correo: Joi.string().email().required(),
    contrasena: Joi.string().min(6).required(),
    confirmarContrasena: Joi.string().min(6).required(),
    terminosAceptados: Joi.boolean().required(),
    paisSeleccionado: Joi.string().min(2).max(100).required(),
    telefono: Joi.string().min(7).max(20).required(),
    departamentoSeleccionado: Joi.string().optional().allow(''),
    provinciaSeleccionada: Joi.string().optional().allow(''),
    distritoSeleccionado: Joi.string().optional().allow(''),
    estadoExtranjero: Joi.string().optional().allow(''),
    direccion: Joi.string().optional().allow(''),
    cargo: Joi.string().min(2).max(100).required()
});

const personaNaturalSinUsuarioSchema = personaNaturalSchema.fork(['contrasena', 'confirmarContrasena'], (schema) => schema.optional().allow(''));

export const createPersonaJuridicaDto = Joi.object({
    tipoDocumento: Joi.string().valid('RUC').required(),
    numeroDocumento: Joi.string().min(8).max(20).required(),
    razonSocial: Joi.string().min(2).max(255).required(),
    correo: Joi.string().email().required(),
    telefono: Joi.string().min(7).max(20).required(),
    direccion: Joi.string().min(5).max(500).required(),
    departamentoSeleccionado: Joi.string().min(2).max(100).required(),
    provinciaSeleccionada: Joi.string().min(2).max(100).required(),
    distritoSeleccionado: Joi.string().min(2).max(100).required(),
    estadoExtranjero: Joi.string().min(2).max(100).optional().allow(''),
    paisSeleccionado: Joi.string().min(2).max(100).required(),
    terminosAceptados: Joi.boolean().valid(true).required(),
    contrasena: Joi.string().min(6).required(),
    confirmarContrasena: Joi.string().min(6).required(),
    accionistas: Joi.array().items(personaNaturalSinUsuarioSchema.fork(['cargo'], (schema) => schema.optional()).keys({
        porcentaje: Joi.number().min(0).max(100).optional().default(0)
    })).optional(),
    representantesLegales: Joi.array().items(personaNaturalSinUsuarioSchema).optional()
});