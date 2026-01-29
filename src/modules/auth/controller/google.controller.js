import { AppError } from "../../../core/errors/app-error.js";
import { googleLoginService, googleRegisterService } from "../services/google.service.js";
import { ApiResponse } from "../../../core/utils/api-response.js";

  export async function googleRegisterController(req, res, next) {
    try {
      const { idToken } = req.body;
    
      if (!idToken) {
        throw new AppError(
          "Token de Google requerido",
          400,
          "GOOGLE_TOKEN_REQUIRED"
        );
      }
    
      const result = await googleRegisterService({ idToken });
      return ApiResponse.success(res, result);

    } catch(error) {
      next(error);
    }
  }

  export async function googleLoginController(req, res, next) {
    try {
      const { idToken } = req.body;
    
      if (!idToken) {
        throw new AppError(
          "Token de Google requerido",
          400,
          "GOOGLE_TOKEN_REQUIRED"
        );
      }
    
      const result = await googleLoginService({ idToken });
      return ApiResponse.success(res, result);

    } catch(error) {
      next(error);
    }
  }