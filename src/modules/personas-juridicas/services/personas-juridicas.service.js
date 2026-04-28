import { personasJuridicasRepository } from '../repository/personas-juridicas.repository.js';
import { representantesLegalesRepository } from '../../representantes-legales/repository/representantes-legales.repository.js';
import { accionistasRepository } from '../../accionistas/repository/accionistas.repository.js';
import { personasNaturalesRepository } from '../../personas-naturales/repository/personas-naturales.repository.js';
import { authRepository } from '../../auth/repository/auth.repository.js';
import { hashPassword } from '../../../core/utils/hash.util.js';
import { AppError } from '../../../core/errors/app-error.js';
import pool from '../../../keys.js';
import { sendWelcomeEmail } from '../../../core/mail/mail.service.js';

export const personasJuridicasService = {
    // Verificar si numeroDocumento ya existe
    async findByNumeroDocumento(numeroDocumento) {
        const query = 'SELECT id FROM personas_juridicas WHERE numeroDocumento = ?';
        const [rows] = await pool.execute(query, [numeroDocumento]);
        return rows[0] || null;
    },

    // Crear persona jurídica
    async createPersonaJuridica(personaData) {
        const trx = await pool.getConnection();

    try {
        await trx.beginTransaction();
        // Verificar unicidad dentro de la transacción si aplica
        const existingDoc = await this.findByNumeroDocumento(personaData.numeroDocumento, trx);
        if (existingDoc) {
            throw new AppError('El número de documento ya existe', 400, 'DOCUMENTO_EXISTS');
        }

        const {
            accionistas,
            representantesLegales,
            contrasena,
            confirmarContrasena,
            ...personaFields
        } = personaData;

        const personaId = await personasJuridicasRepository.create(personaFields, trx);

        const ubicacion = {
            departamentoSeleccionado: personaFields.departamentoSeleccionado,
            provinciaSeleccionada: personaFields.provinciaSeleccionada,
            distritoSeleccionado: personaFields.distritoSeleccionado,
            estadoExtranjero: personaFields.estadoExtranjero,
            paisSeleccionado: personaFields.paisSeleccionado
        };

        if (accionistas && accionistas.length > 0) {
            for (const acc of accionistas) {
                const { contrasena, confirmarContrasena, cargo, ...accFields } = acc;

                const accData = {
                    ...accFields,
                    ...ubicacion
                };

                const personaNaturalId = await personasNaturalesRepository.create(accData, trx);

                await accionistasRepository.create({
                    personaJuridicaId: personaId,
                    personaNaturalId,
                    porcentaje: acc.porcentaje || 0
                }, trx);
            }
        }

        if (representantesLegales && representantesLegales.length > 0) {
            for (const rep of representantesLegales) {
                const { contrasena, confirmarContrasena, ...repFields } = rep;

                const repData = {
                    ...repFields,
                    ...ubicacion
                };

                const personaNaturalId = await personasNaturalesRepository.create(repData, trx);

                await representantesLegalesRepository.create({
                    personaJuridicaId: personaId,
                    personaNaturalId,
                    cargo: rep.cargo,
                    correo: rep.correo,
                    telefono: rep.telefono
                }, trx);
            }
        }

        const passwordHash = await hashPassword(contrasena);

        await authRepository.createVerifiedUser({
            correo: personaFields.correo,
            passwordHash,
            authProvider: 0,
            nombres: personaFields.razonSocial,
            apellidos: '',
            telefono: personaFields.telefono
        }, trx);

        await trx.commit();

        try {
          await sendWelcomeEmail({
            to: personaData.correo,
            nombre: personaData.razonSocial,
          });
        } catch (mailErr) {
          console.log("⚠️ No se pudo enviar bienvenida:", mailErr.message);
          // opcional: guardar pendiente para reintento
        }

        return { id: personaId, ...personaFields };
    } catch (error) {
        await trx.rollback();
        throw error;
    } finally {
    }
},
/*     async createPersonaJuridica(personaData) {
        // Verificar unicidad
        const existingDoc = await this.findByNumeroDocumento(personaData.numeroDocumento);
        if (existingDoc) {
            throw new AppError('El número de documento ya existe', 400, 'DOCUMENTO_EXISTS');
        }

        const { accionistas, representantesLegales, contrasena, confirmarContrasena, ...personaFields } = personaData;
        const personaId = await personasJuridicasRepository.create(personaFields);

        // Heredar ubicación para accionistas y representantes
        const ubicacion = {
            departamentoSeleccionado: personaFields.departamentoSeleccionado,
            provinciaSeleccionada: personaFields.provinciaSeleccionada,
            distritoSeleccionado: personaFields.distritoSeleccionado,
            estadoExtranjero: personaFields.estadoExtranjero,
            paisSeleccionado: personaFields.paisSeleccionado
        };

        // Crear accionistas si se proporcionan
        if (accionistas && accionistas.length > 0) {
            for (const acc of accionistas) {
                const { contrasena, confirmarContrasena, cargo, ...accFields } = acc;
                const accData = { ...accFields, ...ubicacion };
                const personaNaturalId = await personasNaturalesRepository.create(accData);
                await accionistasRepository.create({
                    personaJuridicaId: personaId,
                    personaNaturalId,
                    porcentaje: acc.porcentaje || 0
                });
            }
        }

        // Crear representantes legales si se proporcionan
        if (representantesLegales && representantesLegales.length > 0) {
            for (const rep of representantesLegales) {
                const { contrasena, confirmarContrasena, ...repFields } = rep;
                const repData = { ...repFields, ...ubicacion };
                const personaNaturalId = await personasNaturalesRepository.create(repData);
                await representantesLegalesRepository.create({
                    personaJuridicaId: personaId,
                    personaNaturalId,
                    cargo: rep.cargo,
                    correo: rep.correo,
                    telefono: rep.telefono
                });
            }
        }

        // Crear usuario para la persona jurídica
        const passwordHash = await hashPassword(contrasena);
        await authRepository.createVerifiedUser({
            correo: personaFields.correo,
            passwordHash,
            authProvider: 0, // Internal
            nombres: personaFields.razonSocial,
            apellidos: '',
            telefono: personaFields.telefono
        });

        return { id: personaId, ...personaFields };
    }, */

    // Obtener por ID con relaciones
    async getPersonaJuridicaById(id) {
        const persona = await personasJuridicasRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona jurídica no encontrada', 404, 'PERSONA_JURIDICA_NOT_FOUND');
        }

        persona.accionistas = await personasJuridicasRepository.findAccionistasByJuridica(id);
        persona.representantesLegales = await personasJuridicasRepository.findRepresentantesByJuridica(id);

        return persona;
    },

    // Listar todas
    async getAllPersonasJuridicas() {
        return await personasJuridicasRepository.findAll();
    },

    // Actualizar
    async updatePersonaJuridica(id, updateData) {
        const persona = await personasJuridicasRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona jurídica no encontrada', 404, 'PERSONA_JURIDICA_NOT_FOUND');
        }

        await personasJuridicasRepository.update(id, updateData);
        return await this.getPersonaJuridicaById(id);
    },

    // Eliminar
    async deletePersonaJuridica(id) {
        const persona = await personasJuridicasRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona jurídica no encontrada', 404, 'PERSONA_JURIDICA_NOT_FOUND');
        }

        await personasJuridicasRepository.delete(id);
    }
};