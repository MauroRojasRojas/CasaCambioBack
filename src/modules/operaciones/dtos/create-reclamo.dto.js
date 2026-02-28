import Joi from "joi";

export const createReclamoDto = Joi.object({
  email: Joi.string().email().max(120).required().messages({
    "string.email": "El correo electrónico no es válido",
    "string.max": "El correo no debe exceder 120 caracteres",
    "any.required": "El correo electrónico es obligatorio",
    "string.empty": "El correo electrónico es obligatorio",
  }),

  date: Joi.date().required().messages({
    "date.base": "La fecha debe ser una fecha válida",
    "any.required": "La fecha es obligatoria",
  }),

  firstName: Joi.string().trim().min(2).max(60).required().messages({
    "string.empty": "Los nombres son obligatorios",
    "string.min": "Los nombres deben tener al menos 2 caracteres",
    "string.max": "Los nombres no deben exceder 60 caracteres",
    "any.required": "Los nombres son obligatorios",
  }),

  fatherSurname: Joi.string().trim().min(2).max(60).required().messages({
    "string.empty": "El apellido paterno es obligatorio",
    "string.min": "El apellido paterno debe tener al menos 2 caracteres",
    "string.max": "El apellido paterno no debe exceder 60 caracteres",
    "any.required": "El apellido paterno es obligatorio",
  }),

  motherSurname: Joi.string().trim().min(2).max(60).required().messages({
    "string.empty": "El apellido materno es obligatorio",
    "string.min": "El apellido materno debe tener al menos 2 caracteres",
    "string.max": "El apellido materno no debe exceder 60 caracteres",
    "any.required": "El apellido materno es obligatorio",
  }),

  documentType: Joi.string().valid("DNI", "CE", "PAS").required().messages({
    "any.only": "El tipo de documento debe ser DNI, CE o PAS",
    "any.required": "El tipo de documento es obligatorio",
  }),

  documentNumber: Joi.string().trim().min(6).max(12).required().messages({
    "string.empty": "El número de documento es obligatorio",
    "string.min": "El número de documento debe tener al menos 6 caracteres",
    "string.max": "El número de documento no debe exceder 12 caracteres",
    "any.required": "El número de documento es obligatorio",
  }),

  address: Joi.string().trim().min(5).max(150).required().messages({
    "string.empty": "La dirección es obligatoria",
    "string.min": "La dirección debe tener al menos 5 caracteres",
    "string.max": "La dirección no debe exceder 150 caracteres",
    "any.required": "La dirección es obligatoria",
  }),

  district: Joi.string().trim().min(2).max(60).required().messages({
    "string.empty": "El distrito es obligatorio",
    "string.max": "El distrito no debe exceder 60 caracteres",
    "any.required": "El distrito es obligatorio",
  }),

  province: Joi.string().trim().min(2).max(60).required().messages({
    "string.empty": "La provincia es obligatoria",
    "string.max": "La provincia no debe exceder 60 caracteres",
    "any.required": "La provincia es obligatoria",
  }),

  department: Joi.string().trim().min(2).max(60).required().messages({
    "string.empty": "El departamento es obligatorio",
    "string.max": "El departamento no debe exceder 60 caracteres",
    "any.required": "El departamento es obligatorio",
  }),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9+\s()-]{6,15}$/)
    .max(15)
    .required()
    .messages({
      "string.empty": "El teléfono es obligatorio",
      "string.pattern.base": "El teléfono no es válido",
      "string.max": "El teléfono no debe exceder 15 caracteres",
      "any.required": "El teléfono es obligatorio",
    }),

  service: Joi.string().trim().max(60).default("Cambio de divisas").messages({
    "string.max": "El servicio no debe exceder 60 caracteres",
  }),

  operationNumber: Joi.string().trim().min(3).max(40).required().messages({
    "string.empty": "El número de operación es obligatorio",
    "string.min": "El número de operación debe tener al menos 3 caracteres",
    "string.max": "El número de operación no debe exceder 40 caracteres",
    "any.required": "El número de operación es obligatorio",
  }),

  // Permitir uno de los dos (o ambos), pero no ambos nulos
  amountSoles: Joi.number().positive().precision(2).allow(null).messages({
    "number.base": "El monto (Soles) debe ser un número",
    "number.positive": "El monto (Soles) debe ser positivo",
  }),

  amountDollars: Joi.number().positive().precision(2).allow(null).messages({
    "number.base": "El monto (Dólares) debe ser un número",
    "number.positive": "El monto (Dólares) debe ser positivo",
  }),

  complaintType: Joi.string().valid("reclamo", "queja").required().messages({
    "any.only": "El tipo de reclamo debe ser Reclamo o Queja",
    "any.required": "El tipo de reclamo es obligatorio",
  }),

  detail: Joi.string().trim().min(10).max(1000).required().messages({
    "string.empty": "El detalle del reclamo es obligatorio",
    "string.min": "El detalle del reclamo debe tener al menos 10 caracteres",
    "string.max": "El detalle no debe exceder 1000 caracteres",
    "any.required": "El detalle del reclamo es obligatorio",
  }),

  request: Joi.string().trim().min(5).max(500).required().messages({
    "string.empty": "La solicitud del cliente es obligatoria",
    "string.min": "La solicitud del cliente debe tener al menos 5 caracteres",
    "string.max": "La solicitud del cliente no debe exceder 500 caracteres",
    "any.required": "La solicitud del cliente es obligatoria",
  }),

  declaration: Joi.boolean().valid(true).required().messages({
    "any.only": "Debe aceptar la declaración",
    "any.required": "Debe aceptar la declaración",
  }),
})
  // regla: al menos un monto
  .custom((value, helpers) => {
    const hasSoles =
      value.amountSoles !== null && value.amountSoles !== undefined;
    const hasDollars =
      value.amountDollars !== null && value.amountDollars !== undefined;

    if (!hasSoles && !hasDollars) {
      return helpers.message(
        "Debe ingresar el monto en soles o en dólares"
      );
    }
    return value;
  });