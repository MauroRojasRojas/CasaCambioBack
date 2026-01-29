import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AppError } from "../../../core/errors/app-error.js";
import { hashPassword } from "../../../core/utils/hash.util.js";
import { authRepository } from "../repository/auth.repository.js";
import { verifyGoogleToken } from "./google-auth.service.js";

export async function googleRegisterService({ idToken }) {
  try {
    // 1. Validar token Google
    const googleUser = await verifyGoogleToken(idToken);
  
    // 2. Buscar usuario existente (todos los estados)
    let user = await authRepository.findUserByMail(googleUser.email);
    if (user && user.estadoId !== 1) {
      throw new AppError(
        "La cuenta se encuentra inhabilitada",
        403,
        "AUTH_USER_DISABLED"
      );
    }

    if (user && user.perfilCompleto) {
      const rol = await authRepository.findRolById(user.idRol);
  
      if (!rol) {
        throw new AppError(
          "El rol asignado al usuario no existe.",
          500,
          "AUTH_ROLE_NOT_FOUND"
        );
      }
      const refreshToken = crypto.randomBytes(64).toString("hex");
  
      await authRepository.saveRefreshToken({
        idUsuario: user.idUsuario,
        refreshToken,
        expiresInDays: 7,
      });
  
      const token = jwt.sign(
        {
          idUsuario: user.idUsuario,
          correo: user.correo,
          rol: rol.codigoSistema,
          //rol: user.idRol
        },
        process.env.KEY_JWT,
        { expiresIn: "15m" }
      );
  
      return {
        user: {
          idUsuario: user.idUsuario,
          nombres: user.nombres,
          apellidos: user.apellidos,
          correo: user.correo,
          telefono: user.telefono,
          rolNombre: rol.nombre,
          rolCodigo: rol.codigoSistema,
          perfilCompleto: user.perfilCompleto,
          creadoEn: user.creadoEn
        },
        status: "ACCOUNT_READY",
        token,
        refreshToken
      };
    }

    // 3. Si NO existe → crear como pendiente
    if (!user) {
      const DUMMY_PASSWORD = crypto.randomBytes(32).toString('hex');
      const dummyHash = await hashPassword(DUMMY_PASSWORD);
      const idUsuario = await authRepository.createPendingUser({
        correo: googleUser.email,
        passwordHash: dummyHash,
        authProvider: 1 //External
      });
  
      // activar directamente (Google ya validó email)
      await authRepository.verifyEmail(idUsuario);
  
      user = await authRepository.findUserByMailAllStates(googleUser.email);
    }
  
    // 5. Mandar SIEMPRE a completar perfil (tu decisión)
    return {
      status: "GOOGLE_VERIFIED",
      user: {
        correo: user.correo,
        nombres: googleUser.nombres ?? "",
        apellidos: googleUser.apellidos ?? "",
        telefono: null,
        perfilCompleto: user.perfilCompleto,
      },
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      'Error interno al registrar con Google',
      500,
      'GOOGLE_REGISTER_FAILED'
    );
  }
}

export async function googleLoginService({ idToken }) {
  try {
    // 1. Validar token Google
    const googleUser = await verifyGoogleToken(idToken);

    // 2. Buscar usuario en el sistema
    let user = await authRepository.findUserByMail(googleUser.email);

    if (user && user.estadoId !== 1) {
      throw new AppError(
        "La cuenta se encuentra inhabilitada",
        403,
        "AUTH_USER_DISABLED"
      );
    }

    // 4. SI NO EXISTE → crear usuario Google
    if (!user) {
      const dummyPassword = crypto.randomBytes(32).toString("hex");
      const dummyHash = await hashPassword(dummyPassword);

      const idUsuario = await authRepository.createPendingUser({
        correo: googleUser.email,
        passwordHash: dummyHash,
        authProvider: 1 // GOOGLE
      });

      // Google ya validó el correo
      await authRepository.verifyEmail(idUsuario);

      user = await authRepository.findUserByMailAllStates(googleUser.email);
    }

    // 5. PERFIL COMPLETO → LOGIN DIRECTO

      const rol = await authRepository.findRolById(user.idRol);

      const token = jwt.sign(
        {
          idUsuario: user.idUsuario,
          correo: user.correo,
          rol: rol.codigoSistema
        },
        process.env.KEY_JWT,
        { expiresIn: "8h" }
      );

      const refreshToken = crypto.randomBytes(64).toString("hex");

      await authRepository.saveRefreshToken({
        idUsuario: user.idUsuario,
        refreshToken,
        expiresInDays: 7
      });

      return {
        status: "ACCOUNT_READY",
        token,
        refreshToken,
        user: {
          idUsuario: user.idUsuario,
          correo: user.correo,
          nombres: user.nombres,
          apellidos: user.apellidos,
          telefono: user.telefono,
          perfilCompleto: user.perfilCompleto,
          rolCodigo: rol.codigoSistema,
          creadoEn: user.creadoEn
        }
      };

  } catch (error) {
    if (error instanceof AppError) throw error;

    throw new AppError(
      "Error al autenticar con Google",
      500,
      "GOOGLE_LOGIN_FAILED"
    );
  }
}

