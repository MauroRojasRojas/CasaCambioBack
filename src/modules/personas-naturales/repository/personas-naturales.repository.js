import pool from '../../../keys.js';

export const personasNaturalesRepository = {
    // Crear una persona natural
    async create(personaData) {
        console.log('Repository: Insertando persona');
        const {
            tipoDocumento, numeroDocumento, nombres, apellidos, genero, fechaNacimiento,
            correo, telefono, direccion, departamentoSeleccionado, provinciaSeleccionada,
            distritoSeleccionado, estadoExtranjero, paisSeleccionado, terminosAceptados
        } = personaData;

        const query = `INSERT INTO personas_naturales (tipoDocumento, numeroDocumento, nombres, apellidos, genero, fechaNacimiento, correo, telefono, direccion, departamentoSeleccionado, provinciaSeleccionada, distritoSeleccionado, estadoExtranjero, paisSeleccionado, terminosAceptados) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [
            tipoDocumento, numeroDocumento, nombres, apellidos, genero, fechaNacimiento,
            correo, telefono, direccion, departamentoSeleccionado, provinciaSeleccionada,
            distritoSeleccionado, estadoExtranjero, paisSeleccionado, terminosAceptados
        ];

        console.log('Query:', query);
        console.log('Values:', values);

        const [result] = await pool.execute(query, values);
        const id = result.insertId;
        console.log('Persona insertada ID:', id);

        // Generar código
        const codigo = `${id}N`;
        console.log('Generando código:', codigo);
        await pool.execute('UPDATE personas_naturales SET codigo = ? WHERE id = ?', [codigo, id]);
        console.log('Código actualizado');

        return id;
    },

    // Obtener por ID
    async findById(id) {
        const query = `
            SELECT 
                pn.*,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_naturales pn
            LEFT JOIN departamento d ON pn.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pn.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pn.distritoSeleccionado = di.id
            WHERE pn.id = ?
        `;
        const [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    },

    // Obtener todas
    async findAll() {
        const query = `
            SELECT 
                pn.*,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_naturales pn
            LEFT JOIN departamento d ON pn.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pn.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pn.distritoSeleccionado = di.id
            WHERE pn.estado = "activo" 
            ORDER BY pn.fechaCreacion DESC
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

        const query = `UPDATE personas_naturales SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await pool.execute(query, values);
    },

    // Eliminar
    async delete(id) {
        const query = 'UPDATE personas_naturales SET estado = ? WHERE id = ?';
        await pool.execute(query, ['inactivo', id]);
    }
};