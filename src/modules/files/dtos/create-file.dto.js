import { AppError } from "../../../core/errors/app-error.js";

export class CreateFileDTO {
  constructor(body) {
    this.entidad = body.entidad;          // Ej: "tiposHabitacion" | "habitaciones"
    this.idEntidad = body.idEntidad;      // ID del registro asociado
    this.keyFile = body.keyFile;                  // Key de AWS S3 (ruta del archivo)
    this.url = body.url;                  // URL pública final
    this.filename = body.filename;        // Nombre del archivo
    this.size = body.size;
    this.contentType = body.contentType;  // MIME- type (image/png, pdf, etc)

    this.validate();
  }

  validate() {
    if (!this.entidad) {
      throw new AppError("Entidad es requerida.", 400, "VALIDATION_ERROR");
    }

    if (!this.idEntidad || isNaN(this.idEntidad)) {
      throw new AppError("Entidad asociada inválida.", 400, "VALIDATION_ERROR");
    }

    if (!this.keyFile) {
      throw new AppError("Key de almacenamiento requerida.", 400, "VALIDATION_ERROR");
    }

    if (!this.url) {
      throw new AppError("URL pública requerida.", 400, "VALIDATION_ERROR");
    }

    if (!this.filename) {
      throw new AppError("Nombre de archivo requerido.", 400, "VALIDATION_ERROR");
    }

    if (!this.size) {
      throw new AppError("Peso del archivo requerido.", 400, "VALIDATION_ERROR");
    }

    if (!this.contentType) {
      throw new AppError("Content-Type requerido.", 400, "VALIDATION_ERROR");
    }
  }
}
