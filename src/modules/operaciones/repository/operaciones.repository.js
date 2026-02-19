import pool from '../../../keys.js';

export const operacionesRepository = {
  // ===========================
  // Crear operación
  // ===========================
  create: async ({
    personaCode,
    cuentaBancariaOrigenId,
    cuentaBancariaDestinoId,
    montoEnviado,
    monedaEnviada,
    montoRecibido,
    monedaRecibida,
    tipoOperacion,
    codigoOperacion,
    fechaEmision,
    estado = 'PENDIENTE',
    tasaCompra,
    tasaVenta
  }) => {
    const sql = `
      INSERT INTO operaciones (
        personaCode,
        cuentaBancariaOrigenId,
        cuentaBancariaDestinoId,
        montoEnviado,
        monedaEnviada,
        montoRecibido,
        monedaRecibida,
        tipoOperacion,
        codigoOperacion,
        fechaEmision,
        estado,
        tasaCompra,
        tasaVenta
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(sql, [
      personaCode,
      cuentaBancariaOrigenId,
      cuentaBancariaDestinoId,
      montoEnviado,
      monedaEnviada,
      montoRecibido,
      monedaRecibida,
      tipoOperacion,
      codigoOperacion,
      fechaEmision,
      estado,
      tasaCompra,
      tasaVenta
    ]);

    return result.insertId;
  },

  // ===========================
  // Obtener todas las operaciones
  // ===========================
  findAll: async () => {
    const sql = `
      SELECT
        id,
        personaCode,
        cuentaBancariaOrigenId,
        cuentaBancariaDestinoId,
        montoEnviado,
        monedaEnviada,
        montoRecibido,
        monedaRecibida,
        tipoOperacion,
        codigoOperacion,
        fechaEmision,
        estado,
        tasaCompra,
        tasaVenta
      FROM operaciones
      ORDER BY fechaEmision DESC
    `;

    const [rows] = await pool.query(sql);
    return rows;
  },

  // ===========================
  // Obtener operación por ID
  // ===========================
  findById: async (id) => {
    const sql = `
      SELECT
        id,
        personaCode,
        cuentaBancariaOrigenId,
        cuentaBancariaDestinoId,
        montoEnviado,
        monedaEnviada,
        montoRecibido,
        monedaRecibida,
        tipoOperacion,
        codigoOperacion,
        fechaEmision,
        estado,
        tasaCompra,
        tasaVenta
      FROM operaciones
      WHERE id = ?
    `;

    const [rows] = await pool.query(sql, [id]);
    return rows[0] || null;
  },

  // ===========================
  // Obtener operaciones por código de persona
  // ===========================
  findByPersonaCode: async (personaCode) => {
    const sql = `
      SELECT
        id,
        personaCode,
        cuentaBancariaOrigenId,
        cuentaBancariaDestinoId,
        montoEnviado,
        monedaEnviada,
        montoRecibido,
        monedaRecibida,
        tipoOperacion,
        codigoOperacion,
        fechaEmision,
        estado,
        tasaCompra,
        tasaVenta
      FROM operaciones
      WHERE personaCode = ?
      ORDER BY fechaEmision DESC
    `;

    const [rows] = await pool.query(sql, [personaCode]);
    return rows;
  },

  // ===========================
  // Actualizar operación
  // ===========================
  update: async (id, {
    personaCode,
    cuentaBancariaOrigenId,
    cuentaBancariaDestinoId,
    montoEnviado,
    monedaEnviada,
    montoRecibido,
    monedaRecibida,
    tipoOperacion,
    codigoOperacion,
    fechaEmision,
    estado,
    tasaCompra,
    tasaVenta
  }) => {
    const sql = `
      UPDATE operaciones
      SET
        personaCode = ?,
        cuentaBancariaOrigenId = ?,
        cuentaBancariaDestinoId = ?,
        montoEnviado = ?,
        monedaEnviada = ?,
        montoRecibido = ?,
        monedaRecibida = ?,
        tipoOperacion = ?,
        codigoOperacion = ?,
        fechaEmision = ?,
        estado = ?,
        tasaCompra = ?,
        tasaVenta = ?
      WHERE id = ?
    `;

    const [result] = await pool.query(sql, [
      personaCode,
      cuentaBancariaOrigenId,
      cuentaBancariaDestinoId,
      montoEnviado,
      monedaEnviada,
      montoRecibido,
      monedaRecibida,
      tipoOperacion,
      codigoOperacion,
      fechaEmision,
      estado,
      tasaCompra,
      tasaVenta,
      id
    ]);

    return result.affectedRows > 0;
  },

  // ===========================
  // Eliminar operación
  // ===========================
  delete: async (id) => {
    const sql = `DELETE FROM operaciones WHERE id = ?`;

    const [result] = await pool.query(sql, [id]);
    return result.affectedRows > 0;
  }
};