import jwt from "jsonwebtoken";
import { AppError } from "../../core/errors/app-error.js";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Token no proporcionado", 401, "AUTH_TOKEN_MISSING");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.KEY_JWT);
    req.user = decoded;
    console.log('decoded', decoded)
    next();
  } catch (error) {
    console.log('error', error)
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        "Su sesión ha expirado.",
        401,
        "AUTH_SESSION_EXPIRED"
      );
    }

    // 3️⃣ Token inválido (modificado, corrupto, firmado con otra clave, etc.)
    throw new AppError(
      "Token inválido.",
      401,
      "AUTH_INVALID_TOKEN"
    );
  }
};