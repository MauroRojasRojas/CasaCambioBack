import { AppError } from "../../../core/errors/app-error.js";
import { hashPassword } from "../../../core/utils/hash.util.js";
import { usersRepository } from "../repository/users.repository.js";
import bcrypt from "bcrypt";

export const usersService = {
  // =====================================
  // LISTAR TODOS
  // =====================================
  async listUsers({ search, page, limit, type }) {
    const result = await usersRepository.findAllPaginated({ search, page, limit, type });
  
    const totalPages = Math.ceil(result.total / limit);
  
    return {
      data: result.data,
      meta: {
        page,
        limit,
        total: result.total,
        pages: totalPages
      }
    };
  },

  // =====================================
  // CREAR
  // =====================================
  async createUser(dto) {
    const exists = await usersRepository.existsMail(dto.correo);
    if (exists) {
      throw new AppError("El correo ya está registrado.", 400, "EMAIL_EXISTS");
    }

    const hash = await hashPassword(dto.password);

    const id = await usersRepository.create({
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      correo: dto.correo,
      hash,
      idRol: dto.idRol,
      creadoPor: dto.creadoPor
    });

    return { idUsuario: id };
  },

  // =====================================
  // ACTUALIZAR
  // =====================================
  async updateUser(idUsuario, dto) {
    const user = await usersRepository.findById(idUsuario);

    if (!user) {
      throw new AppError("Usuario no encontrado.", 404, "USER_NOT_FOUND");
    }

    await usersRepository.update({
      idUsuario,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      idRol: dto.idRol,
      actualizadoPor: dto.actualizadoPor
    });

    return { message: "Usuario actualizado correctamente." };
  },

  async updateProfileService(idUsuario, dto) {
    const user = await usersRepository.findById(idUsuario);

    if (!user) {
      throw new AppError("Usuario no encontrado.", 404, "USER_NOT_FOUND");
    }

    await usersRepository.updatePorfile({
      idUsuario,
      nombres: dto.nombres,
      apellidos: dto.apellidos,
      telefono: dto.telefono,
      actualizadoPor: idUsuario
    });

    return true;
  },

  // =====================================
  // CAMBIAR ESTADO
  // =====================================
  async changeStatus(idUsuario, dto, userUpdId) {
    const user = await usersRepository.findById(idUsuario);

    if (!user) {
      throw new AppError("Usuario no encontrado.", 404, "USER_NOT_FOUND");
    }

    await usersRepository.changeStatus(idUsuario, dto.estadoId, userUpdId);

    return { message: "Estado actualizado correctamente." };
  },

  async changePassword(idUsuario, dto, userUpdId) {
    const user = await usersRepository.findById(idUsuario);

    if (!user) {
      throw new AppError("Usuario no encontrado.", 404, "USER_NOT_FOUND");
    }

    const hash = await hashPassword(dto.password);
    await usersRepository.changePassword(idUsuario, hash, userUpdId);

    return { message: "Estado actualizado correctamente." };
  },
  async changeMyPassword(idUsuario, dto) {
    const user = await usersRepository.findById(idUsuario);
  
    if (!user) {
      throw new AppError(
        "Usuario no encontrado.",
        404,
        "USER_NOT_FOUND"
      );
    }
  
    const validPassword = await bcrypt.compare(
      dto.currentPassword,
      user.contraseniaHash
    );
  
    if (!validPassword) {
      throw new AppError(
        "La contraseña actual es incorrecta.",
        400,
        "INVALID_CURRENT_PASSWORD"
      );
    }
  
    const samePassword = await bcrypt.compare(
      dto.newPassword,
      user.contraseniaHash
    );
  
    if (samePassword) {
      throw new AppError(
        "La nueva contraseña debe ser diferente a la actual.",
        400,
        "PASSWORD_SAME_AS_OLD"
      );
    }
  
    const hash = await hashPassword(dto.newPassword);
  
    await usersRepository.changePassword(
      idUsuario,
      hash,
      idUsuario // actualizadoPor = el mismo usuario
    );
  
    return true;
  }
};
