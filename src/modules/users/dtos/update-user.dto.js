import { AppError } from "../../../core/errors/app-error.js";

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

