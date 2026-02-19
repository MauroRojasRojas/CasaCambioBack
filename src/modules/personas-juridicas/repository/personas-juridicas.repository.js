import pool from '../../../keys.js';

export const personasJuridicasRepository = {
    // Crear una persona jurídica
    async create(personaData) {
        const {
            tipoDocumento, numeroDocumento, razonSocial, correo, telefono, direccion,
            departamentoSeleccionado, provinciaSeleccionada, distritoSeleccionado,
            estadoExtranjero, paisSeleccionado, terminosAceptados
        } = personaData;

        const query = `
            INSERT INTO personas_juridicas (
                tipoDocumento, numeroDocumento, razonSocial, correo, telefono, direccion,
                departamentoSeleccionado, provinciaSeleccionada, distritoSeleccionado,
                estadoExtranjero, paisSeleccionado, terminosAceptados
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            tipoDocumento, numeroDocumento, razonSocial, correo, telefono, direccion,
            departamentoSeleccionado, provinciaSeleccionada, distritoSeleccionado,
            estadoExtranjero, paisSeleccionado, terminosAceptados
        ];

        const [result] = await pool.execute(query, values);
        const id = result.insertId;

        // Generar código
        const codigo = `${id}J`;
        await pool.execute('UPDATE personas_juridicas SET codigo = ? WHERE id = ?', [codigo, id]);

        return id;
    },

    // Obtener por ID
    async findById(id) {
        const query = `
            SELECT 
                pj.*,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_juridicas pj
            LEFT JOIN departamento d ON pj.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pj.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pj.distritoSeleccionado = di.id
            WHERE pj.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    },

    // Obtener todas
    async findAll() {
        const query = `
            SELECT 
                pj.*,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_juridicas pj
            LEFT JOIN departamento d ON pj.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pj.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pj.distritoSeleccionado = di.id
            WHERE pj.estado = "activo" 
            ORDER BY pj.fechaCreacion DESC
        `;
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

        const query = `UPDATE personas_juridicas SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await pool.execute(query, values);
    },

    // Eliminar
    async delete(id) {
        const query = 'UPDATE personas_juridicas SET estado = ? WHERE id = ?';
        await pool.execute(query, ['inactivo', id]);
    },

    // Obtener accionistas
    async findAccionistasByJuridica(personaJuridicaId) {
        const query = `
            SELECT a.*, p.nombres, p.apellidos, p.numeroDocumento
            FROM accionistas a
            JOIN personas_naturales p ON a.personaNaturalId = p.id
            WHERE a.personaJuridicaId = ?
        `;
        const [rows] = await pool.execute(query, [personaJuridicaId]);
        return rows;
    },

    // Obtener representantes
    async findRepresentantesByJuridica(personaJuridicaId) {
        const query = `
            SELECT r.*, p.nombreCompleto, p.numeroDocumento
            FROM representantes_legales r
            JOIN personas_naturales p ON r.personaNaturalId = p.id
            WHERE r.personaJuridicaId = ?
        `;
        const [rows] = await pool.execute(query, [personaJuridicaId]);
        return rows;
    }
};