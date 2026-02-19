import { personasNaturalesRepository } from '../repository/personas-naturales.repository.js';
import { usersService } from '../../users/services/users.service.js';
import { AppError } from '../../../core/errors/app-error.js';
import pool from '../../../keys.js';

export const personasNaturalesService = {
    // Verificar si numeroDocumento ya existe
    async findByNumeroDocumento(numeroDocumento) {
        const query = 'SELECT id FROM personas_naturales WHERE numeroDocumento = ?';
        const [rows] = await pool.execute(query, [numeroDocumento]);
        return rows[0] || null;
    },

    // Crear persona natural
    async createPersonaNatural(personaData) {
        console.log('Service: Verificando documento existente');
        // Verificar unicidad
        const existingDoc = await this.findByNumeroDocumento(personaData.numeroDocumento);
        if (existingDoc) {
            throw new AppError('El número de documento ya existe', 400, 'DOCUMENTO_EXISTS');
        }

        console.log('Service: Creando persona en DB');
        const personaId = await personasNaturalesRepository.create(personaData);
        console.log('Persona ID:', personaId);

        console.log('Service: Creando usuario');
        try {
            await usersService.createUser({
                nombres: personaData.nombres,
                apellidos: personaData.apellidos,
                telefono: personaData.telefono,
                correo: personaData.correo,
                password: personaData.contrasena,
                creadoPor: null
            });
            console.log('Usuario creado');
        } catch (userError) {
            console.log('Error creando usuario:', userError.message);
            // Si falla, eliminar persona
            await personasNaturalesRepository.delete(personaId);
            throw new AppError('Error al crear usuario: ' + userError.message, 500, 'USER_CREATION_FAILED');
        }
        return { id: personaId, ...personaData };
    },

    // Obtener por ID
    async getPersonaNaturalById(id) {
        const persona = await personasNaturalesRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona natural no encontrada', 404, 'PERSONA_NATURAL_NOT_FOUND');
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
            throw new AppError('Persona natural no encontrada', 404, 'PERSONA_NATURAL_NOT_FOUND');
        }

        await personasNaturalesRepository.update(id, updateData);
        return await this.getPersonaNaturalById(id);
    },

    // Eliminar
    async deletePersonaNatural(id) {
        const persona = await personasNaturalesRepository.findById(id);
        if (!persona) {
            throw new AppError('Persona natural no encontrada', 404, 'PERSONA_NATURAL_NOT_FOUND');
        }

        await personasNaturalesRepository.delete(id);
    }
};