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
  // Obtener todas las operaciones (admin — datos enriquecidos)
  // ===========================
  findAllAdmin: async ({ desde, hasta, estados }) => {
    let sql = `
      SELECT
        o.id,
        COALESCE(CONCAT(pn.nombres, ' ', pn.apellidos), pj.razonSocial) AS cliente,
        COALESCE(pn.numeroDocumento, pj.numeroDocumento) AS documento,
        COALESCE(pn.telefono, pj.telefono) AS telefono,
        COALESCE(pn.correo, pj.correo) AS correo,
        o.codigoOperacion,
        cb.numeroCuenta,
        CASE
          WHEN o.tipoOperacion = 'COMPRA' THEN o.tasaCompra
          WHEN o.tipoOperacion = 'VENTA' THEN o.tasaVenta
        END AS tasaCambio,
        o.tipoOperacion,
        o.montoEnviado,
        o.monedaEnviada,
        o.montoRecibido,
        o.monedaRecibida,
        o.fechaEmision,
        o.estado
      FROM operaciones o
      LEFT JOIN personas_juridicas pj ON pj.codigo = o.personaCode
      LEFT JOIN personas_naturales pn ON pn.codigo = o.personaCode
      INNER JOIN cuentas_bancarias cb ON cb.id = o.cuentaBancariaDestinoId
      WHERE COALESCE(pn.nombres, pj.razonSocial) IS NOT NULL
    `;
    const params = [];
    if (desde && hasta) {
      sql += ` AND o.fechaEmision BETWEEN ? AND ?`;
      params.push(desde, hasta);
    }
    if (estados && estados.length > 0) {
      sql += ` AND o.estado IN (${estados.map(() => '?').join(',')})`;
      params.push(...estados);
    }
    sql += ` ORDER BY o.fechaEmision DESC`;
    const [rows] = await pool.query(sql, params);
    return rows;
  },

  // ===========================
  // Estadísticas de operaciones
  // ===========================
  getEstadisticas: async ({ desde, hasta, agrupacion }) => {
    let groupBy;
    if (agrupacion === 'mes') {
      groupBy = "DATE_FORMAT(o.fechaEmision, '%Y-%m')";
    } else if (agrupacion === 'semana') {
      groupBy = "DATE_FORMAT(o.fechaEmision, '%Y-%u')";
    } else {
      groupBy = "DATE(o.fechaEmision)";
    }

    let sql = `
      SELECT
        ${groupBy} AS periodo,
        COUNT(*) AS totalOperaciones,
        SUM(CASE WHEN o.tipoOperacion = 'COMPRA' THEN o.montoEnviado ELSE 0 END) AS totalCompraUSD,
        SUM(CASE WHEN o.tipoOperacion = 'VENTA' THEN o.montoEnviado ELSE 0 END) AS totalVentaPEN,
        SUM(o.montoEnviado) AS totalEnviado,
        SUM(o.montoRecibido) AS totalRecibido
      FROM operaciones o
      WHERE 1=1
    `;
    const params = [];
    if (desde && hasta) {
      sql += ` AND o.fechaEmision BETWEEN ? AND ?`;
      params.push(desde, hasta);
    }
    sql += ` GROUP BY ${groupBy} ORDER BY periodo DESC`;
    const [rows] = await pool.query(sql, params);
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
  // Obtener operación con datos del cliente por código
  // ===========================
  findByCodigoOperacion: async (codigoOperacion) => {
    const sql = `
      SELECT
        o.id,
        o.personaCode,
        o.cuentaBancariaOrigenId,
        o.cuentaBancariaDestinoId,
        o.montoEnviado,
        o.monedaEnviada,
        o.montoRecibido,
        o.monedaRecibida,
        o.tipoOperacion,
        o.codigoOperacion,
        o.fechaEmision,
        o.estado,
        o.tasaCompra,
        o.tasaVenta,
        COALESCE(CONCAT(pn.nombres, ' ', pn.apellidos), pj.razonSocial) AS cliente,
        COALESCE(pn.correo, pj.correo) AS correoCliente,
        COALESCE(pn.nombres, pj.razonSocial) AS nombreCliente
      FROM operaciones o
      LEFT JOIN personas_juridicas pj ON pj.codigo = o.personaCode
      LEFT JOIN personas_naturales pn ON pn.codigo = o.personaCode
      WHERE o.codigoOperacion = ?
    `;
    const [rows] = await pool.query(sql, [codigoOperacion]);
    return rows[0] || null;
  },

  // ===========================
  // Actualizar solo el estado
  // ===========================
  updateEstado: async (codigoOperacion, estado) => {
    const sql = `UPDATE operaciones SET estado = ? WHERE codigoOperacion = ?`;
    const [result] = await pool.query(sql, [estado, codigoOperacion]);
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