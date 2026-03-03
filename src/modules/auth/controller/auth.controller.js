import { ApiResponse } from "../../../core/utils/api-response.js";
import { loginService, verifySession, resendOtpService, refreshTokenService, verifyPermission, completeProfileService, registerService, verifyEmailService, logoutService } from "../services/auth.service.js";
import { LoginRequestDTO } from "../dtos/login-request.dto.js";
import { AppError } from "../../../core/errors/app-error.js";
import { forgotPasswordService, resetPasswordService, validateResetTokenService } from "../services/password-reset.service.js";
import { authRepository } from "../repository/auth.repository.js";

export async function login(req, res, next) {
  try {
    const dto = new LoginRequestDTO(req.body);

    const result = await loginService({
      correo: dto.email,
      password: dto.password
    });

    return ApiResponse.success(res, result, "Login correcto");
    
  } catch (err) {
    next(err);
  }
}

export async function verifyMe(req, res, next) {
  try {
    const dto = {
      idUsuario: req.user.idUsuario,
      correoToken: req.user.correo,
      rolToken: req.user.rol,
      modulo: req.query.modulo ?? null  // módulo opcional en la consulta
    };

    const user = await verifySession(dto);

    return ApiResponse.success(res, { user }, "Sesión válida");
  } catch (error) {
    next(error);
  }
}

export async function verifyModulePermission(req, res, next) {
    try {
        const { dni, modulo, codEntidad } = req.user;
        const { routerLink } = req.query;

        if (!routerLink) {
            throw new AppError("El módulo accedido es inválido", 400, "VALIDATION_ERROR");
        }

        const allow = await verifyPermission({
            dni,
            modulo,
            codEntidad,
            routerLink,
        });

        return ApiResponse.success(res, { allow }, "OK");
    } catch (err) {
        next(err);
    }
}

export async function register(req, res, next) {
  try {
    const result = await registerService(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const result = await verifyEmailService(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
}

export async function completeProfile(req, res, next) {
  try {
    const result = await completeProfileService(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
}

export async function resendOtp(req, res, next) {
  try {
    const result = await resendOtpService(req.body);
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
}

export async function refreshTokenController(req, res, next) {
  try {
    const { refreshToken } = req.body;

    const result = await refreshTokenService({ refreshToken });

    return ApiResponse.success(res, result);
  } catch (error) {
    next(error);
  }
}

export async function logoutController(req, res, next) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError(
        "Refresh token requerido",
        400,
        "AUTH_REFRESH_REQUIRED"
      );
    }

    await logoutService({ refreshToken });

    return ApiResponse.success(res, null, "Sesión cerrada correctamente");
  } catch (error) {
    next(error);
  }
}

export async function forgotPasswordController(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("El correo electrónico es obligatorio.", 400, "VALIDATION_ERROR");
    }

    const user = await authRepository.findUserByMailAllStates(email);
    if (!user) {
      throw new AppError("El correo no existe en nuestros registros.", 404, "EMAIL_NOT_FOUND");
    }

    const result = await forgotPasswordService({ email });

    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
}

export async function validateResetTokenController(req, res, next) {
  try {
    const { token } = req.body;
    if (!token) throw new AppError("Token requerido", 400, "TOKEN_REQUIRED");

    const result = await validateResetTokenService({ token });
    return ApiResponse.success(res, result, "OK");
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordController(req, res, next) {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      throw new AppError("Datos incompletos", 400, "AUTH_REQUIRED_FIELDS");
    }

    const result = await resetPasswordService({ token, password, confirmPassword });
    return ApiResponse.success(res, result, result.message);
  } catch (error) {
    next(error);
  }
}