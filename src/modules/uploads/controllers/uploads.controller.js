import { ApiResponse } from "../../../core/utils/api-response.js";
import { PresignedDTO } from "../dto/presigned.dto.js";
import { uploadsService } from "../services/uploads.service.js";

export async function getPresigned(req, res, next) {
  try {
    const dto = new PresignedDTO(req.body);
    const result = await uploadsService.generatePresignedUrl(dto);
    return ApiResponse.success(res, result, "URL generada");
  } catch (err) {
    next(err);
  }
}
