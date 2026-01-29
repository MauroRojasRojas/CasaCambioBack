import { AppError } from "../../../core/errors/app-error.js";
import { archivosRepository } from "../repository/files.repository.js";

export const archivosService = {

  // Registrar metadata de un archivo (después del upload a S3)
  create: async (data) => {
    const { entidad, idEntidad, keyFile, filename, url, contentType, size, creadoPor } = data;

    const idArchivo = await archivosRepository.create({
      entidad,
      idEntidad,
      keyFile,
      filename,
      url,
      contentType,
      size,
      creadoPor
    });

    return { idArchivo, url, filename };
  },

  // Listar archivos de una entidad (habitaciones o tiposHabitacion)
  listByEntidad: async ({ entidad, idEntidad }) => {
    const rows = await archivosRepository.findByEntidad({ entidad, idEntidad });

    if (!rows) return [];

    return rows.map((x) => ({
      idArchivo: x.idArchivo,
      url: x.url,
      filename: x.filename,
      contentType: x.contentType,
      key: x.key,
      estadoId: x.estadoId,
      creadoEn: x.creadoEn
    }));
  },

  // Eliminar (soft delete)
  delete: async (idArchivo, userId) => {
    const exist = await archivosRepository.findById(idArchivo);
    if (!exist) {
      throw new AppError("El archivo no existe", 404, "NOT_FOUND");
    }

    await archivosRepository.updateEstado({
      idArchivo,
      estadoId: 0,      // ✨ Estado 0 = Eliminado
      actualizadoPor: userId
    });

    return true;
  },

  // Renombrar archivo
  rename: async (idArchivo, filename, userId) => {
    const exist = await archivosRepository.findById(idArchivo);
    if (!exist) {
      throw new AppError("El archivo no existe", 404, "NOT_FOUND");
    }

    await archivosRepository.rename({
      idArchivo,
      filename,
      actualizadoPor: userId
    });

    return true;
  },
  async findByEntity(entidad, idEntidad) {
    return archivosRepository.findByEntity(entidad, idEntidad);
  }

};
