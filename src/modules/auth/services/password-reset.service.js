import crypto from "crypto";
import { AppError } from "../../../core/errors/app-error.js";
import { authRepository } from "../repository/auth.repository.js";
import { passwordResetRepository } from "../repository/password-reset.repository.js";
import { hashPassword } from "../../../core/utils/hash.util.js";
import { sendPasswordResetEmail } from "../../../core/mail/mail.service.js"; // lo creas abajo

export async function forgotPasswordService({ email }) {

    const user = await authRepository.findUserByMailAllStates(email);
  
    // Respuesta genérica SIEMPRE
    const generic = {
      status: "RESET_EMAIL_SENT",
      message: "Si el correo existe, te enviaremos instrucciones."
    };
  
    if (!user) return generic;
    const MAX_RESETS = 5;
    const RESET_WINDOW_MINUTES = 30;
    
    // 🔒 desbloquea si ya pasó el lock
    await passwordResetRepository.resetPasswordResetIfUnlocked(user.idUsuario);
    
    // 🚫 limitar generación de resets
    const recentCount =
      await passwordResetRepository.countRecentPasswordResets(
        user.idUsuario,
        RESET_WINDOW_MINUTES
      );
    
    if (recentCount >= MAX_RESETS) {
      throw new AppError(
        "Demasiadas solicitudes. Intente nuevamente más tarde.",
        429,
        "RESET_BLOCKED"
      );
    }
  
    // 🔐 Token
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    console.log("TOKEN RECIBIDO:", token);
console.log("HASH CALCULADO:", tokenHash);
  
    await passwordResetRepository.invalidatePasswordResets(user.idUsuario);
    await passwordResetRepository.createPasswordReset({
      idUsuario: user.idUsuario,
      tokenHash
    });
  
    // 📧 Enviar correo
    const resetUrl = `${process.env.FRONT_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail({ to: email, resetUrl });
  
    return generic;
  }
export async function validateResetTokenService({ token }) {
  const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
  
  const record = await passwordResetRepository.findValidPasswordReset(tokenHash);

  if (!record) {
    return { valid: false };
  }

  // Opcional: para mostrar el correo en pantalla o algo, puedes traerlo
  return { valid: true };
}

export async function resetPasswordService({
  token,
  password,
  confirmPassword
}) {

  if (password !== confirmPassword) {
    throw new AppError("Las contraseñas no coinciden", 400);
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const reset =
    await passwordResetRepository.findValidPasswordReset(tokenHash);

  if (!reset) {
    throw new AppError(
      "Token inválido o expirado",
      400,
      "RESET_INVALID"
    );
  }

  // ⛔ Intentos
  if (reset.attempts >= 5) {
    await passwordResetRepository.lockPasswordReset(reset.idReset);
    throw new AppError(
      "Demasiados intentos. Intente más tarde.",
      429,
      "RESET_LOCKED"
    );
  }

  // 🔐 Cambiar password
  const hash = await hashPassword(password);
  await authRepository.updatePassword(reset.idUsuario, hash);

  // ✅ marcar reset usado
  await passwordResetRepository.markPasswordResetUsed(reset.idReset);

  // 🔒 Revocar sesiones
  await authRepository.revokeAllRefreshTokensByUser(reset.idUsuario);

  return {
    status: "PASSWORD_RESET_OK",
    message: "Contraseña actualizada correctamente"
  };
}
