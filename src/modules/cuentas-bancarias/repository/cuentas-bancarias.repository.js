import pool from '../../../keys.js';

export const cuentasBancariasRepository = {
    // Crear una cuenta bancaria
    async create(cuentaData) {
        const {
            banco, numeroCuenta, tipoCuenta, moneda, titular, estado, saldo, codigoPersona
        } = cuentaData;

        const query = `
            INSERT INTO cuentas_bancarias (
                banco, numeroCuenta, tipoCuenta, moneda, titular, estado, saldo, fechaRegistro, codigoPersona
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)
        `;
        const values = [
            banco, numeroCuenta, tipoCuenta, moneda, titular, estado, saldo, codigoPersona
        ];

        const [result] = await pool.execute(query, values);
        return result.insertId;
    },

    // Obtener por ID
    async findById(id) {
        const query = 'SELECT * FROM cuentas_bancarias WHERE id = ?';
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    },

    // Obtener todas
    async findAll() {
        const query = 'SELECT * FROM cuentas_bancarias ORDER BY fechaRegistro DESC';
        const [rows] = await pool.execute(query);
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

        const query = `UPDATE cuentas_bancarias SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await pool.execute(query, values);
    },

    // Eliminar (cambiar estado a inactivo)
    async delete(id) {
        const query = 'UPDATE cuentas_bancarias SET estado = 0 WHERE id = ?';
        await pool.execute(query, [id]);
    },

    // Obtener cuentas por código de persona
    async findByCodigoPersona(codigoPersona) {
        const query = 'SELECT * FROM cuentas_bancarias WHERE codigoPersona = ? ORDER BY fechaRegistro DESC';
        const [rows] = await pool.execute(query, [codigoPersona]);
        return rows;
    }
};