import { ApiResponse } from '../../../core/utils/api-response.js';
import { createContactUsDto } from '../dtos/create-contact.dto.js';
import { contactUsService } from '../services/contact.service.js';

export const contactUsController = {
  create: async (req, res) => {
    try {
      const { error, value } = createContactUsDto.validate(req.body, {
        abortEarly: true,
        stripUnknown: true,
      });

      if (error) {
        return ApiResponse.error(res, error.details[0].message, 400);
      }

      const result = await contactUsService.send(value);
      ApiResponse.success(res, 'Mensaje enviado correctamente', result, 201);
    } catch (err) {
      ApiResponse.error(res, err.message, err.status || 500);
    }
  },
};