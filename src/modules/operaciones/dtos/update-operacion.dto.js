import Joi from 'joi';

export const updateOperacionDto = Joi.object({
  personaCode: Joi.string().optional().messages({
    'string.empty': 'El código de persona no puede estar vacío'
  }),
  cuentaBancariaOrigenId: Joi.number().integer().positive().optional().messages({
    'number.base': 'La cuenta bancaria origen debe ser un número',
    'number.integer': 'La cuenta bancaria origen debe ser un número entero',
    'number.positive': 'La cuenta bancaria origen debe ser positiva'
  }),
  cuentaBancariaDestinoId: Joi.number().integer().positive().optional().messages({
    'number.base': 'La cuenta bancaria destino debe ser un número',
    'number.integer': 'La cuenta bancaria destino debe ser un número entero',
    'number.positive': 'La cuenta bancaria destino debe ser positiva'
  }),
  montoEnviado: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'El monto enviado debe ser un número',
    'number.positive': 'El monto enviado debe ser positivo'
  }),
  monedaEnviada: Joi.string().valid('PEN', 'USD', 'EUR').optional().messages({
    'any.only': 'La moneda enviada debe ser PEN, USD o EUR'
  }),
  montoRecibido: Joi.number().positive().precision(2).optional().messages({
    'number.base': 'El monto recibido debe ser un número',
    'number.positive': 'El monto recibido debe ser positivo'
  }),
  monedaRecibida: Joi.string().valid('PEN', 'USD', 'EUR').optional().messages({
    'any.only': 'La moneda recibida debe ser PEN, USD o EUR'
  }),
  tipoOperacion: Joi.string().valid('COMPRA', 'VENTA').optional().messages({
    'any.only': 'El tipo de operación debe ser COMPRA o VENTA'
  }),
  codigoOperacion: Joi.string().optional().messages({
    'string.empty': 'El código de operación no puede estar vacío'
  }),
  fechaEmision: Joi.date().optional().messages({
    'date.base': 'La fecha de emisión debe ser una fecha válida'
  }),
  estado: Joi.string().valid('PENDIENTE', 'COMPLETADA', 'CANCELADA').optional().messages({
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