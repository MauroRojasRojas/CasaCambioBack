import Joi from 'joi';

export const createContactUsDto = Joi.object({
  name: Joi.string().trim().min(2).max(200).required().messages({
    'string.empty': 'El nombre es obligatorio',
    'string.min': 'El nombre debe tener al menos 2 caracteres',
    'string.max': 'El nombre no debe exceder 200 caracteres',
    'any.required': 'El nombre es obligatorio',
  }),

  email: Joi.string().email().max(120).required().messages({
    'string.email': 'El correo no es válido',
    'string.empty': 'El correo es obligatorio',
    'string.max': 'El correo no debe exceder 120 caracteres',
    'any.required': 'El correo es obligatorio',
  }),

  subject: Joi.string().trim().min(3).max(120).required().messages({
    'string.empty': 'El asunto es obligatorio',
    'string.min': 'El asunto debe tener al menos 3 caracteres',
    'string.max': 'El asunto no debe exceder 120 caracteres',
    'any.required': 'El asunto es obligatorio',
  }),

  message: Joi.string().trim().min(10).max(2000).required().messages({
    'string.empty': 'El mensaje es obligatorio',
    'string.min': 'El mensaje debe tener al menos 10 caracteres',
    'string.max': 'El mensaje no debe exceder 2000 caracteres',
    'any.required': 'El mensaje es obligatorio',
  }),
});