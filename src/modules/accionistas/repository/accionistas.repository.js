import pool from '../../../keys.js';

export const accionistasRepository = {
    // Crear accionista
    async create(accionistaData) {
        const { personaJuridicaId, personaNaturalId, porcentaje } = accionistaData;
        const query = 'INSERT INTO accionistas (personaJuridicaId, personaNaturalId, porcentaje) VALUES (?, ?, ?)';
        const [result] = await pool.execute(query, [personaJuridicaId, personaNaturalId, porcentaje]);
        return result.insertId;
    },

    // Obtener por ID
    async findById(id) {
        const query = 'SELECT * FROM accionistas WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    },

    // Obtener por jurídica
    async findByJuridica(personaJuridicaId) {
        const query = `
            SELECT a.*, p.nombres, p.apellidos, p.numeroDocumento
            FROM accionistas a
            JOIN personas_naturales p ON a.personaNaturalId = p.id
            WHERE a.personaJuridicaId = ?
        `;
        const [rows] = await pool.execute(query, [personaJuridicaId]);
        return rows;
    },

    // Actualizar
    async update(id, updateData) {
        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (fields.length === 0) return;

        const query = `UPDATE accionistas SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await pool.execute(query, values);
    },

    // Eliminar
    async delete(id) {
        const query = 'DELETE FROM accionistas WHERE id = ?';
        await pool.execute(query, [id]);
    }
};