import { reclamosService } from "../services/reclamos.service.js";
import { createReclamoDto } from "../dtos/create-reclamo.dto.js";
import { ApiResponse } from "../../../core/utils/api-response.js";

export const reclamosController = {
  // ===========================
  // Enviar reclamo (correo)
  // ===========================
  create: async (req, res) => {
    try {
      const { error, value } = createReclamoDto.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
      });

      if (error) {
        return ApiResponse.error(res, error.details[0].message, 400);
      }

      const result = await reclamosService.send(value);
      ApiResponse.success(res, "Reclamo enviado correctamente", result, 201);
    } catch (err) {
      ApiResponse.error(res, err.message, err.status || 500);
    }
  },
};