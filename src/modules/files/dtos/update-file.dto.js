import { AppError } from "../../../core/errors/app-error.js";

export class UpdateFileDTO {
  constructor(body) {
    this.filename = body.filename;
    this.validate();
  }

  validate() {
    if (!this.filename || this.filename.trim().length === 0) {
      throw new AppError("Debe ingresar un nombre de archivo válido.", 400, "VALIDATION_ERROR");
    }

    if (this.filename.length > 255) {
      throw new AppError("El nombre del archivo es demasiado largo.", 400, "VALIDATION_ERROR");
    }
  }
}
