import pool from '../../../keys.js';

export const representantesLegalesRepository = {
    // Crear representante legal
    async create(representanteData, trx) {
        const { personaJuridicaId, personaNaturalId, cargo, correo, telefono } = representanteData;
        const conn = trx || pool;
        const query = 'INSERT INTO representantes_legales (personaJuridicaId, personaNaturalId, cargo, correo, telefono) VALUES (?, ?, ?, ?, ?)';
        const [result] = await conn.execute(query, [personaJuridicaId, personaNaturalId, cargo, correo, telefono]);
        return result.insertId;
    },

    // Obtener por ID
    async findById(id) {
        const query = 'SELECT * FROM representantes_legales WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    },

    // Obtener por jurídica
    async findByJuridica(personaJuridicaId) {
        const query = `
            SELECT r.*, p.nombres, p.apellidos, p.numeroDocumento
            FROM representantes_legales r
            JOIN personas_naturales p ON r.personaNaturalId = p.id
            WHERE r.personaJuridicaId = ?
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

        const query = `UPDATE representantes_legales SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await pool.execute(query, values);
    },

    // Eliminar
    async delete(id) {
        const query = 'DELETE FROM representantes_legales WHERE id = ?';
        await pool.execute(query, [id]);
    }
};