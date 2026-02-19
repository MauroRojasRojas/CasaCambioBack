// @ts-nocheck
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { authRepository } from "../repository/auth.repository.js";
import { AppError } from "../../../core/errors/app-error.js";
import { verifyPassword, hashPassword } from "../../../core/utils/hash.util.js";
import { sendOtpEmail } from "../../../core/mail/mail.service.js"
import pool from "../../../keys.js";

export async function loginService({ correo, password }) {
  // Buscar usuario por correo
  const user = await authRepository.findUserByMail(correo);

  if (!user) {
    throw new AppError("Credenciales incorrectas", 401, "AUTH_INVALID_CREDENTIALS");
  }

  if (user.estadoId !== 1) {
    throw new AppError(
      "Cuenta inhabilitada",
      403,
      "AUTH_USER_DISABLED"
    );
  }

  if (!user.emailVerificado) {
    throw new AppError(
      "Debe verificar su correo",
      403,
      "AUTH_EMAIL_NOT_VERIFIED"
    );
  }

  const valid = await verifyPassword(password, user.contraseniaHash);
  if (!valid) {
    throw new AppError(
      "Credenciales incorrectas",
      401,
      "AUTH_INVALID_CREDENTIALS"
    );
  }

  // Obtener rol del usuario
  const rol = await authRepository.findRolById(user.idRol);

  if (!rol) {
    throw new AppError("El rol asignado al usuario no existe.", 500, "AUTH_ROLE_NOT_FOUND");
  }

  // Obtener módulos permitidos (solo dashboard)
  let modulos = [];

  if (rol.codigoSistema !== "ROLE_CLIENT") {
    modulos = await authRepository.getModulosPermitidos(rol.idRol);
  }

  // Buscar persona asociada
  const [naturalRows] = await pool.execute('SELECT id, codigo FROM personas_naturales WHERE correo = ? LIMIT 1', [user.correo]);
  const [juridicaRows] = await pool.execute('SELECT id, codigo FROM personas_juridicas WHERE correo = ? LIMIT 1', [user.correo]);

  let rolCodigoFinal = rol.codigoSistema;
  let perfilCompletoFinal = user.perfilCompleto;

  if (naturalRows.length > 0) {
    rolCodigoFinal = "USER_NATURAL";
    perfilCompletoFinal = naturalRows[0].codigo;
  } else if (juridicaRows.length > 0) {
    rolCodigoFinal = "USER_JURIDICA";
    perfilCompletoFinal = juridicaRows[0].codigo;
  }

  // Generar token
  const token = jwt.sign(
    {
      idUsuario: user.idUsuario,
      correo: user.correo,
      rol: rolCodigoFinal,
      //rol: user.idRol
    },
    process.env.KEY_JWT,
    { expiresIn: "15m" }
  );

  // 6. Refresh Token (LARGO)
  const refreshToken = crypto.randomBytes(64).toString("hex");

  await authRepository.saveRefreshToken({
    idUsuario: user.idUsuario,
    refreshToken,
    expiresInDays: 7,
  });


  return {
    user: {
      idUsuario: user.idUsuario,
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo: user.correo,
      telefono: user.telefono,
      rolNombre: rol.nombre,
      rolCodigo: rolCodigoFinal,
      perfilCompleto: perfilCompletoFinal,
      creadoEn: user.creadoEn,
      fullName: `${user.nombres} ${user.apellidos}`.trim()
    },
    modulos,
    token,
    refreshToken
  };
}

export async function verifySession(dto) {

  // 1. Verificar que el usuario exista en BD
  const userDb = await authRepository.findUserById(dto.idUsuario);

  if (!userDb) {
    throw new AppError("Sesión inválida.", 401, "AUTH_INVALID_SESSION");
  }

  // 2. Verificar que el correo del token coincida
  if (userDb.correo !== dto.correoToken) {
    throw new AppError("Token adulterado.", 401, "AUTH_INVALID_SESSION");
  }

  // 3. Verificar que el rol del token coincida con la BD
  if (userDb.rolCodigo !== dto.rolToken) {
    throw new AppError("Rol inválido o modificado.", 401, "AUTH_INVALID_SESSION");
  }

  // 4. Si se consultó un módulo específico, validar permisos
  let tienePermiso = true;

  //validad aqui
  /* if (dto.modulo) {
    const modulosPermitidos = await authRepository.getModulosPermitidos(userDb.idRol);
    tienePermiso = modulosPermitidos.includes(dto.modulo);

    if (!tienePermiso) {
      throw new AppError("No tiene permisos para este módulo.", 403, "AUTH_FORBIDDEN");
    }
  } */
 console.log('userdb', userDb)

  // 5. Respuesta final (misma estructura que tu login)
  return {
    idUsuario: userDb.idUsuario,
    nombres: userDb.nombres,
    apellidos: userDb.apellidos,
    correo: userDb.correo,
    telefono: userDb.telefono,
    celular: userDb.celular,
    rolNombre: userDb.rolNombre,
    rolCodigo: userDb.rolCodigo,
    perfilCompleto: userDb.perfilCompleto,
    creadoEn: userDb.creadoEn,
    modulos: tienePermiso 
      ? await authRepository.getModulosPermitidos(userDb.idRol)
      : []
  };
}

export async function verifyPermission({ dni, modulo, codEntidad, routerLink }) {
    const hasAccess = await authRepository.verifyPermission({
        dni,
        modulo,
        codEntidad,
        routerLink
    });

    if (!hasAccess) {
        throw new AppError("No tiene permiso para acceder a este módulo.", 403, "AUTH_MODULE_FORBIDDEN");
    }

    return true;
}

export async function registerService({ correo, password, confirmPassword }) {

  // 1. Validaciones básicas
  if (!correo || !password || !confirmPassword) {
    throw new AppError(
      "El correo y la contraseña son obligatorios",
      400,
      "AUTH_REQUIRED_FIELDS"
    );
  }

  if (password !== confirmPassword) {
    throw new AppError(
      "Las contraseñas ingresadas no coinciden",
      400,
      "AUTH_PASSWORD_MISMATCH"
    );
  }

  // 2. Buscar usuario (todos los estados)
  const user = await authRepository.findUserByMailAllStates(correo);

  if (user && user.emailVerificado === 1) {
    throw new AppError(
      "El correo ya está registrado",
      409,
      "AUTH_EMAIL_EXISTS"
    );
  }

  // 3. Obtener o crear usuario pendiente
  let idUsuario = user?.idUsuario;

  if (!user) {
    const passwordHash = await hashPassword(password);

    idUsuario = await authRepository.createPendingUser({
      correo,
      passwordHash,
      authProvider: 0 //Internal
    });
  }

  // 4. 🔓 Resetear seguridad si bloqueo venció
  await authRepository.resetOtpAttemptsIfUnlocked(idUsuario);

  // 5. Obtener último OTP
  const lastOtp = await authRepository.getLastOtpByUser(idUsuario);

  // 6. Validar bloqueo activo
  if (lastOtp?.lockedUntil && new Date(lastOtp.lockedUntil) > new Date()) {
    throw new AppError(
      "Demasiados intentos. Intente nuevamente más tarde.",
      429,
      "OTP_BLOCKED"
    );
  }

  // 7. Generar OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");

  // 8. Invalidar OTP anteriores
  await authRepository.invalidateOtp(idUsuario);

  // 9. Crear nuevo OTP
  await authRepository.createOtp({
    idUsuario,
    codeHash
  });

  // 10. Enviar correo
  await sendOtpEmail({
    to: correo,
    code
  });

  return {
    status: "PENDING_VERIFICATION",
    message: "Te enviamos un código a tu correo"
  };
}

//Verificar EMAIL
export async function verifyEmailService({ correo, code }) {

  // 1. Validaciones básicas
  if (!correo || !code) {
    throw new AppError(
      "Correo y código son obligatorios",
      400,
      "AUTH_REQUIRED_FIELDS"
    );
  }

  // 2. Buscar usuario
  const user = await authRepository.findUserByMailAllStates(correo);

  if (!user) {
    throw new AppError(
      "Código inválido",
      400,
      "AUTH_INVALID_USER_CODE"
    );
  }

  if (user.estadoId !== 1) {
    throw new AppError(
      "La cuenta se encuentra inhabilitada o bloqueada",
      403,
      "AUTH_USER_DISABLED"
    );
  }

  // 3. 🔓 Resetear intentos SI el bloqueo ya venció
  await authRepository.resetOtpAttemptsIfUnlocked(user.idUsuario);

  // 4. Obtener último OTP actualizado
  const lastOtp = await authRepository.getLastOtpByUser(user.idUsuario);

  // 5. Validar si sigue bloqueado
  if (lastOtp?.lockedUntil && new Date(lastOtp.lockedUntil) > new Date()) {
    throw new AppError(
      "Demasiados intentos. Intente nuevamente más tarde.",
      429,
      "OTP_BLOCKED"
    );
  }

  // 6. Si ya está activo, no repetir flujo
  if (user.emailVerificado) {

    // Caso A: correo verificado PERO perfil incompleto
    if (!user.perfilCompleto) {
      return {
        status: "ALREADY_VERIFIED",
        nextStep: "COMPLETE_PROFILE",
        message: "Correo verificado. Complete su perfil."
      };
    }
  
    // Caso B: correo verificado Y perfil completo
    return {
      status: "ACCOUNT_READY",
      nextStep: "LOGIN",
      message: "La cuenta ya está lista para usar"
    };
  }

  // 7. Hashear código
  const codeHash = crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");

  // 8. Buscar OTP válido
  const otp = await authRepository.findValidOtp({
    idUsuario: user.idUsuario,
    codeHash
  });

  // 9. Código incorrecto
  if (!otp) {
    await authRepository.incrementOtpAttempts(user.idUsuario);

    const updatedOtp = await authRepository.getLastOtpByUser(user.idUsuario);

    if (updatedOtp.attempts >= 5) {
      await authRepository.lockOtpUser(user.idUsuario);

      throw new AppError(
        "Demasiados intentos. Usuario bloqueado temporalmente.",
        429,
        "OTP_LOCKED"
      );
    }

    throw new AppError(
      "Código inválido o expirado",
      400,
      "AUTH_INVALID_CODE"
    );
  }

  // 10. Código correcto → activar usuario
  await authRepository.verifyEmail(user.idUsuario);
  await authRepository.markOtpAsUsed(otp.idOtp);

  // 11. Limpieza final (buena práctica)
  await authRepository.clearOtpSecurity(user.idUsuario);

  return {
    status: "EMAIL_VERIFIED",
    message: "Correo verificado correctamente"
  };
}

//Completar perfil
export async function completeProfileService({ correo, nombres, apellidos, telefono }) {

  // 1. Validaciones básicas
  if (!correo || !nombres || !apellidos || !telefono) {
    throw new AppError(
      "Datos incompletos",
      400,
      "AUTH_REQUIRED_FIELDS"
    );
  }

  // 2. Buscar usuario
  const user = await authRepository.findUserByMailAllStatesProfile(correo);

  if (!user) {
    throw new AppError("Usuario no válido", 400, "AUTH_INVALID_USER");
  }

  if (user.estadoId !== 1) {
    throw new AppError(
      "La cuenta se encuentra inhabilitada",
      403,
      "AUTH_USER_DISABLED"
    );
  }

  // 3. Validar estado
  if (!user.emailVerificado) {
    throw new AppError(
      "Debe verificar su correo electrónico",
      400,
      "AUTH_EMAIL_NOT_VERIFIED"
    );
  }

  // 4. Si ya completó perfil, no repetir
  if (user.perfilCompleto) {
    throw new AppError(
      "El perfil ya fue completado",
      409,
      "AUTH_PROFILE_ALREADY_COMPLETED"
    );
  }

  const rol = await authRepository.findRolById(user.idRol);

  if (!rol) {
    throw new AppError("El rol asignado al usuario no existe.", 500, "AUTH_ROLE_NOT_FOUND");
  }

  // 5. Guardar datos
  await authRepository.updateProfile({
    idUsuario: user.idUsuario,
    nombres,
    apellidos,
    telefono
  });

  // Buscar persona y actualizar perfilCompleto
  const [naturalRows] = await pool.execute('SELECT id, codigo FROM personas_naturales WHERE correo = ? LIMIT 1', [correo]);
  const [juridicaRows] = await pool.execute('SELECT id, codigo FROM personas_juridicas WHERE correo = ? LIMIT 1', [correo]);

  let perfilCompletoId = 0;
  let rolFinal = rol.codigoSistema;
  if (naturalRows.length > 0) {
    perfilCompletoId = naturalRows[0].codigo;
    rolFinal = "USER_NATURAL";
  } else if (juridicaRows.length > 0) {
    perfilCompletoId = juridicaRows[0].codigo;
    rolFinal = "USER_JURIDICA";
  }

  await pool.execute('UPDATE usuarios SET perfilCompleto = ? WHERE idUsuario = ?', [perfilCompletoId, user.idUsuario]);

  const refreshToken = crypto.randomBytes(64).toString("hex");
  
      await authRepository.saveRefreshToken({
        idUsuario: user.idUsuario,
        refreshToken,
        expiresInDays: 7,
      });

  // 6. Generar JWT (AQUÍ recién)
  const token = jwt.sign(
    {
      idUsuario: user.idUsuario,
      correo: user.correo,
      rol: rolFinal
    },
    process.env.KEY_JWT,
    { expiresIn: "8h" }
  );

  // 7. Respuesta
  return {
    status: "PROFILE_COMPLETE",
    token,
    refreshToken,
    user: {
      idUsuario: user.idUsuario,
      nombres,
      apellidos,
      correo: user.correo,
      telefono,
      creadoEn: user.creadoEn,
      perfilCompleto: perfilCompletoId,
      fullName: `${nombres} ${apellidos}`.trim()
    }
  };
}

export async function resendOtpService({ correo }) {

  if (!correo) {
    throw new AppError(
      "Correo obligatorio",
      400,
      "AUTH_REQUIRED_FIELDS"
    );
  }

  const user = await authRepository.findUserByMailAllStates(correo);

  if (!user) {
    throw new AppError(
      "Usuario no válido",
      400,
      "AUTH_INVALID_USER_CODE"
    );
  }

  if (user.emailVerificado) {
    return {
      status: "ALREADY_VERIFIED",
      message: "La cuenta ya está verificada"
    };
  }

  // 🔓 Resetear si bloqueo venció
  await authRepository.resetOtpAttemptsIfUnlocked(user.idUsuario);

  const lastOtp = await authRepository.getLastOtpByUser(user.idUsuario);

  // ⛔ Sigue bloqueado
  if (lastOtp?.lockedUntil && new Date(lastOtp.lockedUntil) > new Date()) {
    throw new AppError(
      "Demasiados intentos. Intente más tarde.",
      429,
      "OTP_BLOCKED"
    );
  }

  // ⏳ Cooldown de reenvío (3 min)
  if (lastOtp?.createdAt) {
    console.log('Date.now()', Date.now());
    console.log('new Date(lastOtp.createdAt).getTime()', new Date(lastOtp.createdAt).getTime());
    const diffMs = Date.now() - new Date(lastOtp.createdAt).getTime();
    const diffMinutes = diffMs / 1000 / 60;
    console.log('diffMs', diffMs);
    console.log('diffMinutes', diffMinutes);

    if (diffMinutes < 3) {
      throw new AppError(
        "Espere unos minutos antes de reenviar el código.",
        429,
        "OTP_TOO_SOON"
      );
    }
  }

  // 🔐 Generar nuevo OTP
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const codeHash = crypto.createHash("sha256").update(code).digest("hex");

  await authRepository.invalidateOtp(user.idUsuario);
  await authRepository.createOtp({
    idUsuario: user.idUsuario,
    codeHash
  });

  await sendOtpEmail({
    to: correo,
    code
  });

  return {
    status: "OTP_RESENT",
    message: "Te reenviamos un nuevo código"
  };
}

export async function refreshTokenService({ refreshToken }) {

  if (!refreshToken) {
    throw new AppError(
      "Refresh token requerido",
      401,
      "AUTH_REFRESH_REQUIRED"
    );
  }

  // 1. Buscar refresh token en BD
  const tokenRecord = await authRepository.findRefreshToken(refreshToken);

  if (!tokenRecord) {
    throw new AppError(
      "Refresh token inválido",
      401,
      "AUTH_REFRESH_INVALID"
    );
  }

  // 2. Verificar revocado
  if (tokenRecord.isRevoked) {
    throw new AppError(
      "Refresh token revocado",
      401,
      "AUTH_REFRESH_REVOKED"
    );
  }

  // 3. Verificar expiración
  const now = new Date();
  const expiresAt = new Date(tokenRecord.expiresAt);

  if (expiresAt <= now) {
    throw new AppError(
      "Refresh token expirado",
      401,
      "AUTH_REFRESH_EXPIRED"
    );
  }

  // 4. Obtener usuario
  const user = await authRepository.findUserById(tokenRecord.idUsuario);

  if (!user) {
    throw new AppError(
      "Usuario no existe",
      401,
      "AUTH_USER_NOT_FOUND"
    );
  }

  const rol = await authRepository.findRolById(user.idRol);

  // 5. Generar NUEVO ACCESS TOKEN
  const accessToken = jwt.sign(
    {
      idUsuario: user.idUsuario,
      correo: user.correo,
      rol: rol.codigoSistema
    },
    process.env.KEY_JWT,
    { expiresIn: "15m" }
  );

  return { accessToken };
}

export async function logoutService({ refreshToken }) {

  if (!refreshToken) {
    return true;
  }

  await authRepository.revokeRefreshToken(refreshToken);

  return true;
}