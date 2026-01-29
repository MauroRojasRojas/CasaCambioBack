import { AppError } from "../../../core/errors/app-error.js";

export class PatchUserDTO {
  constructor(body) {
    this.nombres = body.nombres;
    this.apellidos = body.apellidos;
    this.telefono = body.telefono;
    this.validate();
  }

  validate() {
    if (!this.nombres) throw new AppError("Debe ingresar nombres.", 400, "VALIDATION_ERROR");
    if (!this.apellidos) throw new AppError("Debe ingresar apellidos.", 400, "VALIDATION_ERROR");
  }
}
