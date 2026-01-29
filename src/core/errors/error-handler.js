import { ApiResponse } from "../utils/api-response.js";
import { AppError } from "./app-error.js"

export const errorHandler = (err, req, res, next) => {
  console.error("❌ ERROR:", err);

  // 1) Errores controlados del negocio (AppError)
  if (err instanceof AppError) {
    return ApiResponse.error(res, err);
  }

  if (err.type === "entity.parse.failed") {
    return ApiResponse.error(res, {
      status: 400,
      code: "BAD_JSON_FORMAT",
      message: "El cuerpo de la petición contiene un JSON inválido."
    });
  }

  // 2) Errores inesperados
  return ApiResponse.error(res, {
    status: 500,
    code: "UNEXPECTED_ERROR",
    message: "Error interno del servidor",
  });
};