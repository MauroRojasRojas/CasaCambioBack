import Joi from 'joi';

export const createOperacionDto = Joi.object({
  personaCode: Joi.string().required().messages({
    'string.empty': 'El código de persona es obligatorio',
    'any.required': 'El código de persona es obligatorio'
  }),
  cuentaBancariaOrigenId: Joi.number().integer().positive().required().messages({
    'number.base': 'La cuenta bancaria origen debe ser un número',
    'number.integer': 'La cuenta bancaria origen debe ser un número entero',
    'number.positive': 'La cuenta bancaria origen debe ser positiva',
    'any.required': 'La cuenta bancaria origen es obligatoria'
  }),
  cuentaBancariaDestinoId: Joi.number().integer().positive().required().messages({
    'number.base': 'La cuenta bancaria destino debe ser un número',
    'number.integer': 'La cuenta bancaria destino debe ser un número entero',
    'number.positive': 'La cuenta bancaria destino debe ser positiva',
    'any.required': 'La cuenta bancaria destino es obligatoria'
  }),
  montoEnviado: Joi.number().positive().precision(2).required().messages({
    'number.base': 'El monto enviado debe ser un número',
    'number.positive': 'El monto enviado debe ser positivo',
    'any.required': 'El monto enviado es obligatorio'
  }),
  monedaEnviada: Joi.string().valid('PEN', 'USD', 'EUR').required().messages({
    'any.only': 'La moneda enviada debe ser PEN, USD o EUR',
    'any.required': 'La moneda enviada es obligatoria'
  }),
  montoRecibido: Joi.number().positive().precision(2).required().messages({
    'number.base': 'El monto recibido debe ser un número',
    'number.positive': 'El monto recibido debe ser positivo',
    'any.required': 'El monto recibido es obligatorio'
  }),
  monedaRecibida: Joi.string().valid('PEN', 'USD', 'EUR').required().messages({
    'any.only': 'La moneda recibida debe ser PEN, USD o EUR',
    'any.required': 'La moneda recibida es obligatoria'
  }),
  tipoOperacion: Joi.string().valid('COMPRA', 'VENTA').required().messages({
    'any.only': 'El tipo de operación debe ser COMPRA o VENTA',
    'any.required': 'El tipo de operación es obligatorio'
  }),
  codigoOperacion: Joi.string().required().messages({
    'string.empty': 'El código de operación es obligatorio',
    'any.required': 'El código de operación es obligatorio'
  }),
  fechaEmision: Joi.date().required().messages({
    'date.base': 'La fecha de emisión debe ser una fecha válida',
    'any.required': 'La fecha de emisión es obligatoria'
  }),
  estado: Joi.string().valid('PENDIENTE', 'COMPLETADA', 'CANCELADA').default('PENDIENTE').messages({
    'any.only': 'El estado debe ser PENDIENTE, COMPLETADA o CANCELADA'
  }),
  tasaCompra: Joi.number().positive().precision(4).optional().messages({
    'number.base': 'La tasa de compra debe ser un número',
    'number.positive': 'La tasa de compra debe ser positiva'
  }),
  tasaVenta: Joi.number().positive().precision(4).optional().messages({
    'number.base': 'La tasa de venta debe ser un número',
    'number.positive': 'La tasa de venta debe ser positiva'
  })
});