import { AppError } from "../../core/errors/app-error.js";

export const requireAdmin = (req, res, next) => {
  const userRol = req.user?.userRol;

  if (userRol !== 'ADMIN') {
    throw new AppError(
      "No tienes permisos de administrador para acceder a este recurso.",
      403,
      "AUTH_FORBIDDEN"
    );
  }

  next();
};
