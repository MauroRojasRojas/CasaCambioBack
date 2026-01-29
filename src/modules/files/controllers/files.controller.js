import { ApiResponse } from "../../../core/utils/api-response.js";
import { CreateFileDTO } from "../dtos/create-file.dto.js";
import { UpdateFileDTO } from "../dtos/update-file.dto.js";
import { archivosService } from "../services/files.service.js";

export async function create(req, res, next) {
  try {
    const dto = new CreateFileDTO(req.body);
    const userId = req.user.idUsuario;

    const result = await archivosService.create({
      ...dto,
      creadoPor: userId
    });

    return ApiResponse.success(res, result, "Archivo registrado correctamente");
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const { entidad, idEntidad } = req.params;
    const result = await archivosService.listByEntidad({ entidad, idEntidad });
    return ApiResponse.success(res, result);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const { idArchivo } = req.params;
    const userId = req.user.idUsuario;

    await archivosService.delete(idArchivo, userId);

    return ApiResponse.success(res, null, "Archivo eliminado");
  } catch (err) {
    next(err);
  }
}

export async function rename(req, res, next) {
  try {
    const { idArchivo } = req.params;
    const dto = new UpdateFileDTO(req.body);
    const userId = req.user.idUsuario;

    await archivosService.rename(idArchivo, dto.filename, userId);

    return ApiResponse.success(res, null, "Nombre actualizado correctamente");
  } catch (err) {
    next(err);
  }
}
