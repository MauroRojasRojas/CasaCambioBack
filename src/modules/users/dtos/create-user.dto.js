import { AppError } from "../../../core/errors/app-error.js";

export class CreateUserDTO {
  constructor(body) {
    this.nombres = body.nombres;
    this.apellidos = body.apellidos;
    this.telefono = body.telefono;
    this.celular = body.celular;
    this.correo = body.correo;
    this.password = body.password;
    this.idRol = body.idRol;
    this.validate();
  }

  validate() {
    if (!this.nombres) throw new AppError("Debe ingresar nombres.", 400, "VALIDATION_ERROR");
    if (!this.apellidos) throw new AppError("Debe ingresar apellidos.", 400, "VALIDATION_ERROR");
    if (!this.correo) throw new AppError("Debe ingresar un correo.", 400, "VALIDATION_ERROR");
    if (!this.password) throw new AppError("Debe ingresar una contraseña.", 400, "VALIDATION_ERROR");
    if (!this.idRol) throw new AppError("Debe seleccionar un rol.", 400, "VALIDATION_ERROR");
  }
}

export class UpdateUserDTO {
  constructor(body) {
    this.nombres = body.nombres;
    this.apellidos = body.apellidos;
    this.telefono = body.telefono;
    this.celular = body.celular;
    this.idRol = body.idRol;
    this.validate();
  }

  validate() {
    if (!this.nombres) throw new AppError("Debe ingresar nombres.", 400, "VALIDATION_ERROR");
    if (!this.apellidos) throw new AppError("Debe ingresar apellidos.", 400, "VALIDATION_ERROR");
    if (!this.idRol) throw new AppError("Debe seleccionar un rol.", 400, "VALIDATION_ERROR");
  }
}

export class ChangeStatusUserDTO {
  constructor(body) {
    this.estadoId = body.estadoId;
    this.validate();
  }

  validate() {
    if (this.estadoId !== 1 && this.estadoId !== 0)
      throw new AppError("Estado inválido.", 400, "VALIDATION_ERROR");
  }
}

export class ChangePasswordUserDTO {
  constructor(body) {
    this.password = body.password;
    this.validate();
  }

  validate() {
    if (!this.password) throw new AppError("Debe ingresar una contraseña.", 400, "VALIDATION_ERROR");
  }
}

export class ChangeMyPasswordUserDTO {
  constructor(body) {
    this.currentPassword = body.currentPassword;
    this.newPassword = body.newPassword;
    this.confirmPassword = body.confirmPassword;
    this.validate();
  }

  validate() {
    if (!this.currentPassword) {
      throw new AppError(
        "Debe ingresar su contraseña actual.",
        400,
        "VALIDATION_ERROR"
      );
    }

    if (!this.newPassword) {
      throw new AppError(
        "Debe ingresar una nueva contraseña.",
        400,
        "VALIDATION_ERROR"
      );
    }

    if (!this.confirmPassword) {
      throw new AppError(
        "Debe confirmar la nueva contraseña.",
        400,
        "VALIDATION_ERROR"
      );
    }

    if (this.newPassword !== this.confirmPassword) {
      throw new AppError(
        "Las contraseñas no coinciden.",
        400,
        "PASSWORDS_DO_NOT_MATCH"
      );
    }

    if (this.newPassword.length < 8) {
      throw new AppError(
        "La nueva contraseña debe tener al menos 8 caracteres.",
        400,
        "PASSWORD_TOO_SHORT"
      );
    }
  }
}
