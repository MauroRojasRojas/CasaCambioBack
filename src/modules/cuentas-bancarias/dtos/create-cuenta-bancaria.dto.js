import Joi from 'joi';

export const createCuentaBancariaDto = Joi.object({
    banco: Joi.string().min(2).max(100).required(),
    numeroCuenta: Joi.string().min(10).max(30).required(),
    tipoCuenta: Joi.string().min(2).max(50).required(),
    moneda: Joi.string().min(2).max(10).required(),
    titular: Joi.string().min(2).max(255).required(),
    estado: Joi.boolean().default(true),
    saldo: Joi.number().min(0).default(0),
    codigoPersona: Joi.string().min(2).max(20).required()
});