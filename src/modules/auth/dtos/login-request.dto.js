import { AppError } from "../../../core/errors/app-error.js";

export class LoginRequestDTO {
  constructor(body) {
    this.email = body.email;
    this.password = body.password;
    this.validate();
  }

  validate() {
    if (!this.email) {
      throw new AppError("Debe ingresar su correo.", 400, "VALIDATION_ERROR");
    }

    if (!this.password) {
      throw new AppError("Debe ingresar su contraseña.", 400, "VALIDATION_ERROR");
    }
  }
}