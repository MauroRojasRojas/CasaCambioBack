import Joi from 'joi';

// DTO para crear una persona (natural o jurídica)
export const createPersonaDto = Joi.object({
    tipo: Joi.string().valid('natural', 'juridica').required(),
    tipoDocumento: Joi.string().valid('DNI', 'CE', 'PAS', 'RUC').required(),
    numeroDocumento: Joi.string().min(8).max(20).required(),
    nombres: Joi.string().when('tipo', {
        is: 'natural',
        then: Joi.string().min(2).max(255).required(),
        otherwise: Joi.forbidden()
    }),
    apellidos: Joi.string().when('tipo', {
        is: 'natural',
        then: Joi.string().min(2).max(255).required(),
        otherwise: Joi.forbidden()
    }),
    razonSocial: Joi.string().when('tipo', {
        is: 'juridica',
        then: Joi.string().min(2).max(255).required(),
        otherwise: Joi.forbidden()
    }),
    genero: Joi.string().valid('Masculino', 'Femenino', 'Otro').when('tipo', {
        is: 'natural',
        then: Joi.required(),
        otherwise: Joi.forbidden()
    }),
    correo: Joi.string().email().required(),
    telefono: Joi.string().min(7).max(20).required(),
    direccion: Joi.string().min(5).max(500).required(),
    departamentoSeleccionado: Joi.string().min(2).max(100).required(),
    provinciaSeleccionada: Joi.string().min(2).max(100).required(),
    distritoSeleccionado: Joi.string().min(2).max(100).required(),
    estadoExtranjero: Joi.string().min(2).max(100).optional().allow(''),
    paisSeleccionado: Joi.string().min(2).max(100).optional(), // Cambiado a optional
    terminosAceptados: Joi.boolean().valid(true).required(),
    fechaNacimiento: Joi.date().when('tipo', {
        is: 'natural',
        then: Joi.optional(),
        otherwise: Joi.forbidden()
    }),
    // Campos para usuario (solo para natural)
    contrasena: Joi.string().min(6).max(100).when('tipo', {
        is: 'natural',
        then: Joi.required(),
        otherwise: Joi.forbidden()
    }),
    confirmarContrasena: Joi.string().when('tipo', {
        is: 'natural',
        then: Joi.valid(Joi.ref('contrasena')).required().messages({
            'any.only': 'Las contraseñas no coinciden'
        }),
        otherwise: Joi.forbidden()
    }),
    idRol: Joi.number().integer().positive().when('tipo', {
        is: 'natural',
        then: Joi.optional().default(2), // Default a rol de usuario normal
        otherwise: Joi.forbidden()
    }),
    // Para jurídica: accionistas y representantes con datos completos de naturales
    accionistas: Joi.array().items(
        Joi.object({
            tipoDocumento: Joi.string().valid('DNI', 'CE', 'PAS').required(),
            numeroDocumento: Joi.string().min(8).max(20).required(),
            nombres: Joi.string().min(2).max(255).required(),
            apellidos: Joi.string().min(2).max(255).required(),
            genero: Joi.string().valid('Masculino', 'Femenino', 'Otro').required(),
            fechaNacimiento: Joi.date().optional(),
            correo: Joi.string().email().required(),
            telefono: Joi.string().min(7).max(20).required(),
            direccion: Joi.string().min(5).max(500).required(),
            departamentoSeleccionado: Joi.string().min(2).max(100).required(),
            provinciaSeleccionada: Joi.string().min(2).max(100).required(),
            distritoSeleccionado: Joi.string().min(2).max(100).required(),
            estadoExtranjero: Joi.string().min(2).max(100).optional().allow(''),
            paisSeleccionado: Joi.string().min(2).max(100).optional(),
            terminosAceptados: Joi.boolean().valid(true).required(),
            porcentaje: Joi.number().min(0).max(100).required()
        })
    ).when('tipo', {
        is: 'juridica',
        then: Joi.array().optional(), // Puede estar vacío
        otherwise: Joi.forbidden()
    }),
    representantesLegales: Joi.array().items(
        Joi.object({
            tipoDocumento: Joi.string().valid('DNI', 'CE', 'PAS').required(),
            numeroDocumento: Joi.string().min(8).max(20).required(),
            nombres: Joi.string().min(2).max(255).required(),
            apellidos: Joi.string().min(2).max(255).required(),
            genero: Joi.string().valid('Masculino', 'Femenino', 'Otro').required(),
            fechaNacimiento: Joi.date().optional(),
            correo: Joi.string().email().required(),
            telefono: Joi.string().min(7).max(20).required(),
            direccion: Joi.string().min(5).max(500).required(),
            departamentoSeleccionado: Joi.string().min(2).max(100).required(),
            provinciaSeleccionada: Joi.string().min(2).max(100).required(),
            distritoSeleccionado: Joi.string().min(2).max(100).required(),
            estadoExtranjero: Joi.string().min(2).max(100).optional().allow(''),
            paisSeleccionado: Joi.string().min(2).max(100).optional(),
            terminosAceptados: Joi.boolean().valid(true).required(),
            cargo: Joi.string().min(2).max(100).required(),
            correo: Joi.string().email().optional(), // Específico del representante
            telefono: Joi.string().min(7).max(20).optional() // Específico del representante
        })
    ).when('tipo', {
        is: 'juridica',
        then: Joi.array().min(1).required(),
        otherwise: Joi.forbidden()
    })
});