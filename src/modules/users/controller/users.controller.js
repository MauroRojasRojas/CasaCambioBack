import { ApiResponse } from "../../../core/utils/api-response.js";
import { usersService } from "../services/users.service.js";
import { ChangeMyPasswordUserDTO, ChangePasswordUserDTO, CreateUserDTO } from "../dtos/create-user.dto.js";
import { UpdateUserDTO, ChangeStatusUserDTO } from "../dtos/update-user.dto.js";
import { PatchUserDTO } from "../dtos/patch-user-web-dto.dto.js";

export const usersController = {
    async list(req, res, next) {
        try {
          const page = parseInt(req.query.page) || 1;
          const limit = parseInt(req.query.limit) || 10;
          const search = req.query.search || null;
          const type = req.query.type || null;
      
          const result = await usersService.listUsers({ search, page, limit, type });
      
          return ApiResponse.success(
            res,
            result.data,
            "OK",
            200,
            result.meta
          );
      
        } catch (err) {
          next(err);
        }
    },

  async create(req, res, next) {
    try {
      const userRegId = req.user.idUsuario;
      const dto = new CreateUserDTO(req.body);
      const result = await usersService.createUser({ ...dto, creadoPor: userRegId });
      return ApiResponse.success(res, result, "Usuario creado correctamente");
    } catch (err) {
      next(err);
    }
  },

  async update(req, res, next) {
    try {
      const userUpdId = req.user.idUsuario;
      const id = req.params.id;
      const dto = new UpdateUserDTO(req.body);
      const result = await usersService.updateUser(id, { ...dto, actualizadoPor: userUpdId });
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  },

  async changeStatus(req, res, next) {
    try {
      const userUpdId = req.user.idUsuario;
      const id = req.params.id;
      const dto = new ChangeStatusUserDTO(req.body);
      const result = await usersService.changeStatus(id, dto, userUpdId);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  },

  async changePassword(req, res, next) {
    try {
      const userUpdId = req.user.idUsuario;
      const id = req.params.id;
      const dto = new ChangePasswordUserDTO(req.body);
      const result = await usersService.changePassword(id, dto, userUpdId);
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  },
  async changeMyPassword(req, res, next) {
    try {
      const userId = req.user.idUsuario; // del JWT
      const dto = new ChangeMyPasswordUserDTO(req.body);
  
      const result = await usersService.changeMyPassword(
        userId,
        dto
      );
  
      return ApiResponse.success(res, result);
    } catch (err) {
      next(err);
    }
  },
  async updateProfile(req, res, next) {
    try {
      const id = req.user.idUsuario;
      const dto = new PatchUserDTO(req.body);
  
      const result = await usersService.updateProfileService(id, dto);
  
      return ApiResponse.success(res, result);
  
    } catch (error) {
      next(error);
    }
  }
};
