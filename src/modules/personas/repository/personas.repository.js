import pool from '../../../keys.js';

export const personasRepository = {
    // Crear una persona natural
    async createNatural(personaData) {
        const {
            tipoDocumento, numeroDocumento, nombres, apellidos, genero, fechaNacimiento,
            correo, telefono, direccion, departamentoSeleccionado, provinciaSeleccionada,
            distritoSeleccionado, estadoExtranjero, paisSeleccionado, terminosAceptados
        } = personaData;

        const query = `
            INSERT INTO personas_naturales (
                tipoDocumento, numeroDocumento, nombres, apellidos, genero, fechaNacimiento,
                correo, telefono, direccion, departamentoSeleccionado, provinciaSeleccionada,
                distritoSeleccionado, estadoExtranjero, paisSeleccionado, terminosAceptados
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            tipoDocumento, numeroDocumento, nombres, apellidos, genero, fechaNacimiento,
            correo, telefono, direccion, departamentoSeleccionado, provinciaSeleccionada,
            distritoSeleccionado, estadoExtranjero, paisSeleccionado, terminosAceptados
        ];

        const [result] = await pool.execute(query, values);
        return result.insertId;
    },

    // Crear una persona jurídica
    async createJuridica(personaData) {
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
        return result.insertId;
    },

    // Crear una persona (decide tabla por tipo)
    async create(personaData) {
        if (personaData.tipo === 'natural') {
            return await this.createNatural(personaData);
        } else if (personaData.tipo === 'juridica') {
            return await this.createJuridica(personaData);
        }
        throw new Error('Tipo de persona inválido');
    },

    // Obtener persona por ID (busca en ambas tablas)
    async findById(id) {
        // Buscar en naturales
        let query = `
            SELECT 
                pn.*,
                "natural" as tipo,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_naturales pn
            LEFT JOIN departamento d ON pn.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pn.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pn.distritoSeleccionado = di.id
            WHERE pn.id = ?
        `;
        let [rows] = await pool.execute(query, [id]);
        if (rows.length > 0) {
            return rows[0];
        }
        // Buscar en jurídicas
        query = `
            SELECT 
                pj.*,
                "juridica" as tipo,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_juridicas pj
            LEFT JOIN departamento d ON pj.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pj.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pj.distritoSeleccionado = di.id
            WHERE pj.id = ?
        `;
        [rows] = await pool.execute(query, [id]);
        return rows[0] || null;
    },

    // Obtener todas las personas (union)
    async findAll() {
        const queryNaturales = `
            SELECT 
                pn.*,
                "natural" as tipo,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_naturales pn
            LEFT JOIN departamento d ON pn.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pn.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pn.distritoSeleccionado = di.id
            WHERE pn.estado = "activo"
        `;
        const queryJuridicas = `
            SELECT 
                pj.*,
                "juridica" as tipo,
                d.nombre as departamentoNombre,
                p.nombre as provinciaNombre,
                di.nombre as distritoNombre
            FROM personas_juridicas pj
            LEFT JOIN departamento d ON pj.departamentoSeleccionado = d.id
            LEFT JOIN provincia p ON pj.provinciaSeleccionada = p.id
            LEFT JOIN distrito di ON pj.distritoSeleccionado = di.id
            WHERE pj.estado = "activo"
        `;
        const [naturales] = await pool.execute(queryNaturales);
        const [juridicas] = await pool.execute(queryJuridicas);
        return [...naturales, ...juridicas].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));
    },

    // Actualizar persona
    async update(id, updateData) {
        const persona = await this.findById(id);
        if (!persona) return;

        const fields = [];
        const values = [];

        Object.keys(updateData).forEach(key => {
            if (updateData[key] !== undefined && !['accionistas', 'representantesLegales'].includes(key)) {
                fields.push(`${key} = ?`);
                values.push(updateData[key]);
            }
        });

        if (fields.length === 0) return;

        const table = persona.tipo === 'natural' ? 'personas_naturales' : 'personas_juridicas';
        const query = `UPDATE ${table} SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);

        await pool.execute(query, values);

        // Si hay accionistas o representantes, actualizarlos (simplificado, asumir que se pasan con IDs)
        if (updateData.accionistas && persona.tipo === 'juridica') {
            // Lógica para actualizar accionistas, pero por simplicidad, omitir o implementar si necesario
        }
        if (updateData.representantesLegales && persona.tipo === 'juridica') {
            // Similar
        }
    },

    // Eliminar persona (soft delete)
    async delete(id) {
        const persona = await this.findById(id);
        if (!persona) return;

        const table = persona.tipo === 'natural' ? 'personas_naturales' : 'personas_juridicas';
        const query = `UPDATE ${table} SET estado = ? WHERE id = ?`;
        await pool.execute(query, ['inactivo', id]);
    },

    // Crear accionista
    async createAccionista(personaJuridicaId, accionistaData) {
        const { personaNaturalId, porcentaje } = accionistaData;
        const query = 'INSERT INTO accionistas (personaJuridicaId, personaNaturalId, porcentaje) VALUES (?, ?, ?)';
        await pool.execute(query, [personaJuridicaId, personaNaturalId, porcentaje]);
    },

    // Crear representante legal
    async createRepresentante(personaJuridicaId, representanteData) {
        const { personaNaturalId, cargo, correo, telefono } = representanteData;
        const query = 'INSERT INTO representantes_legales (personaJuridicaId, personaNaturalId, cargo, correo, telefono) VALUES (?, ?, ?, ?, ?)';
        await pool.execute(query, [personaJuridicaId, personaNaturalId, cargo, correo, telefono]);
    },

    // Obtener accionistas de una jurídica
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

    // Obtener representantes de una jurídica
    async findRepresentantesByJuridica(personaJuridicaId) {
        const query = `
            SELECT r.*, p.nombres, p.apellidos, p.numeroDocumento
            FROM representantes_legales r
            JOIN personas_naturales p ON r.personaNaturalId = p.id
            WHERE r.personaJuridicaId = ?
        `;
        const [rows] = await pool.execute(query, [personaJuridicaId]);
        return rows;
    }
};