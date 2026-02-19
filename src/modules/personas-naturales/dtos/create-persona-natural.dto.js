import Joi from 'joi';

export const createPersonaNaturalDto = Joi.object({
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
    paisSeleccionado: Joi.string().min(2).max(100).required(),
    terminosAceptados: Joi.boolean().valid(true).required(),
    // Campos para usuario
    contrasena: Joi.string().min(6).max(100).required(),
    confirmarContrasena: Joi.string().valid(Joi.ref('contrasena')).required().messages({
        'any.only': 'Las contraseñas no coinciden'
    })
});