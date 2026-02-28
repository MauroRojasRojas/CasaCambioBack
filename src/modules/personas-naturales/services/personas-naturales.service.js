import { personasNaturalesRepository } from "../repository/personas-naturales.repository.js";
import { usersService } from "../../users/services/users.service.js";
import { AppError } from "../../../core/errors/app-error.js";
import pool from "../../../keys.js";
import { sendWelcomeEmail } from "../../../core/mail/mail.service.js";

export const personasNaturalesService = {
  // Verificar si numeroDocumento ya existe
  async findByNumeroDocumento(numeroDocumento) {
    const query = "SELECT id FROM personas_naturales WHERE numeroDocumento = ?";
    const [rows] = await pool.execute(query, [numeroDocumento]);
    return rows[0] || null;
  },

  // Crear persona natural
  async createPersonaNatural(personaData) {
    const conn = await pool.getConnection();
    console.log("Service: Verificando documento existente");
    // Verificar unicidad
    const existingDoc = await this.findByNumeroDocumento(
      personaData.numeroDocumento,
    );
    if (existingDoc) {
      throw new AppError(
        "El número de documento ya existe",
        400,
        "DOCUMENTO_EXISTS",
      );
    }

    try {
      await conn.beginTransaction();
      console.log("Service: Creando persona en DB");
      const personaId = await personasNaturalesRepository.create(
        personaData,
        conn,
      );
      console.log("Persona ID:", personaId);

      console.log("Service: Creando usuario");
      await usersService.createUser(
        {
          nombres: personaData.nombres,
          apellidos: personaData.apellidos,
          telefono: personaData.telefono,
          correo: personaData.correo,
          password: personaData.contrasena,
          creadoPor: null,
        },
        conn,
      );
      console.log("Usuario creado");

      await conn.commit();

      // correo afuera del commit
      try {
        await sendWelcomeEmail({
          to: personaData.correo,
          nombre: personaData.nombres,
        });
      } catch (mailErr) {
        console.log("⚠️ No se pudo enviar bienvenida:", mailErr.message);
        // opcional: guardar pendiente para reintento
      }
      return { id: personaId, ...personaData };
    } catch (err) {
      // rollback si algo falló antes del commit
      try {
        await conn.rollback();
      } catch {}

      // si ya estás usando UNIQUE, aquí puedes mapear ER_DUP_ENTRY
      if (err?.code === "ER_DUP_ENTRY") {
        throw new AppError(
          "Documento o correo ya existe.",
          400,
          "DUPLICATE_ENTRY",
        );
      }

      if (err instanceof AppError) throw err;
      throw new AppError(
        err.message || "Error al crear persona",
        500,
        "PERSONA_CREATE_FAILED",
      );
    } finally {
      conn.release();
    }
  },

  // Obtener por ID
  async getPersonaNaturalById(id) {
    const persona = await personasNaturalesRepository.findById(id);
    if (!persona) {
      throw new AppError(
        "Persona natural no encontrada",
        404,
        "PERSONA_NATURAL_NOT_FOUND",
      );
    }
    return persona;
  },

  // Listar todas
  async getAllPersonasNaturales() {
    return await personasNaturalesRepository.findAll();
  },

  // Actualizar
  async updatePersonaNatural(id, updateData) {
    const persona = await personasNaturalesRepository.findById(id);
    if (!persona) {
      throw new AppError(
        "Persona natural no encontrada",
        404,
        "PERSONA_NATURAL_NOT_FOUND",
      );
    }

    await personasNaturalesRepository.update(id, updateData);
    return await this.getPersonaNaturalById(id);
  },

  // Eliminar
  async deletePersonaNatural(id) {
    const persona = await personasNaturalesRepository.findById(id);
    if (!persona) {
      throw new AppError(
        "Persona natural no encontrada",
        404,
        "PERSONA_NATURAL_NOT_FOUND",
      );
    }

    await personasNaturalesRepository.delete(id);
  },
};
