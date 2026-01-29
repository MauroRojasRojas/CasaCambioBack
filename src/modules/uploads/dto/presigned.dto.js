import { AppError } from "../../../core/errors/app-error.js";

export class PresignedDTO {
  constructor(body) {
    this.folder = body.folder;
    this.filename = body.filename;
    this.contentType = body.contentType;
    this.validate();
  }

  validate() {
    if (!this.folder) throw new AppError("Debe especificar la carpeta destino.", 400);
    if (!this.filename) throw new AppError("Debe enviar un nombre de archivo.", 400);
    if (!this.contentType) throw new AppError("Debe enviar el tipo MIME.", 400);
  }
}
