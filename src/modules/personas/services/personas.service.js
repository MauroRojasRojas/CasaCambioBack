import pool from '../../../keys.js';
import { personasRepository } from '../repository/personas.repository.js';
import { usersService } from '../../users/services/users.service.js';
import { AppError } from '../../../core/errors/app-error.js';

export const personasService = {
    // Crear persona
    async createPersona(personaData) {
        // Verificar si el documento ya existe
        const existingNatural = await this.findByNumeroDocumento(personaData.numeroDocumento);
        if (existingNatural) {
            throw new AppError('El número de documento ya existe', 400, 'DOCUMENTO_EXISTS');
        }

        let personaId;
        if (personaData.tipo === 'natural') {
            personaId = await personasRepository.createNatural(personaData);
            // Crear usuario automáticamente
            try {
                await usersService.createUser({
                    nombres: personaData.nombres,
                    apellidos: personaData.apellidos,
                    telefono: personaData.telefono,
                    correo: personaData.correo,
                    password: personaData.contrasena,
                    creadoPor: null // O el id de la persona si se ajusta
                });
            } catch (userError) {
                // Si falla la creación del usuario, eliminar la persona y lanzar error
                await personasRepository.delete(personaId);
                throw new AppError('Error al crear usuario: ' + userError.message, 500, 'USER_CREATION_FAILED');
            }
        } else if (personaData.tipo === 'juridica') {
            // Insertar personas naturales para accionistas y representantes
            const accionistasIds = [];
            if (personaData.accionistas) {
                for (const accionista of personaData.accionistas) {
                    const existing = await this.findByNumeroDocumento(accionista.numeroDocumento);
                    if (existing) {
                        accionistasIds.push({ id: existing.id, porcentaje: accionista.porcentaje });
                    } else {
                        const naturalId = await personasRepository.createNatural(accionista);
                        accionistasIds.push({ id: naturalId, porcentaje: accionista.porcentaje });
                    }
                }
            }

            const representantesIds = [];
            for (const representante of personaData.representantesLegales) {
                const existing = await this.findByNumeroDocumento(representante.numeroDocumento);
                if (existing) {
                    representantesIds.push({ id: existing.id, cargo: representante.cargo, correo: representante.correo, telefono: representante.telefono });
                } else {
                    const naturalId = await personasRepository.createNatural(representante);
                    representantesIds.push({ id: naturalId, cargo: representante.cargo, correo: representante.correo, telefono: representante.telefono });
                }
            }

            // Insertar persona jurídica
            personaId = await personasRepository.createJuridica(personaData);

            // Insertar accionistas
            for (const acc of accionistasIds) {
                await personasRepository.createAccionista(personaId, { personaNaturalId: acc.id, porcentaje: acc.porcentaje });
            }

            // Insertar representantes
            for (const rep of representantesIds) {
                await personasRepository.createRepresentante(personaId, { personaNaturalId: rep.id, cargo: rep.cargo, correo: rep.correo, telefono: rep.telefono });
            }
        }

        return { id: personaId, ...personaData };
    },

    // Método auxiliar para buscar por numeroDocumento
    async findByNumeroDocumento(numeroDocumento) {
        const queryNatural = 'SELECT id, "natural" as tipo FROM personas_naturales WHERE numeroDocumento = ?';
        const [naturales] = await pool.execute(queryNatural, [numeroDocumento]);
        if (naturales.length > 0) return naturales[0];

        const queryJuridica = 'SELECT id, "juridica" as tipo FROM personas_juridicas WHERE numeroDocumento = ?';
        const [juridicas] = await pool.execute(queryJuridica, [numeroDocumento]);
        return juridicas[0] || null;
    },

    // Obtener persona por ID con relaciones
    async getPersonaById(id) {
        const persona = await personasRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona no encontrada', 404, 'PERSONA_NOT_FOUND');
        }

        if (persona.tipo === 'juridica') {
            persona.accionistas = await personasRepository.findAccionistasByJuridica(id);
            persona.representantesLegales = await personasRepository.findRepresentantesByJuridica(id);
        }

        return persona;
    },

    // Listar todas las personas
    async getAllPersonas() {
        return await personasRepository.findAll();
    },

    // Actualizar persona
    async updatePersona(id, updateData) {
        const persona = await personasRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona no encontrada', 404, 'PERSONA_NOT_FOUND');
        }

        await personasRepository.update(id, updateData);
        return await this.getPersonaById(id);
    },

    // Eliminar persona
    async deletePersona(id) {
        const persona = await personasRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona no encontrada', 404, 'PERSONA_NOT_FOUND');
        }

        await personasRepository.delete(id);
    }
};