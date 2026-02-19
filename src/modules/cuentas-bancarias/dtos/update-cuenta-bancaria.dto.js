import Joi from 'joi';

export const updateCuentaBancariaDto = Joi.object({
    banco: Joi.string().min(2).max(100).optional(),
    numeroCuenta: Joi.string().min(10).max(30).optional(),
    tipoCuenta: Joi.string().min(2).max(50).optional(),
    moneda: Joi.string().min(2).max(10).optional(),
    titular: Joi.string().min(2).max(255).optional(),
    estado: Joi.boolean().optional(),
    saldo: Joi.number().min(0).optional(),
    codigoPersona: Joi.string().min(2).max(20).optional()
}).min(1);