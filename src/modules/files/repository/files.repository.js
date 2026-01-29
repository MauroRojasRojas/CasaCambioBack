import pool from '../../../keys.js';

export const archivosRepository = {

  create: async ({ entidad, idEntidad, filename, keyFile, url, contentType, size, creadoPor }) => {
    const sql = `
      INSERT INTO archivos (entidad, idEntidad, filename, keyFile, url, contentType, size, creadoPor)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(sql, [
      entidad,
      idEntidad,
      filename,
      keyFile,
      url,
      contentType,
      size,
      creadoPor
    ]);
    return result.insertId;
  },

  findByEntidad: async ({ entidad, idEntidad }) => {
    const sql = `
      SELECT *
      FROM archivos
      WHERE entidad = ?
        AND idEntidad = ?
        AND estadoId = 1
      ORDER BY idArchivo DESC
    `;
    const [rows] = await pool.query(sql, [entidad, idEntidad]);
    return rows;
  },

  findById: async (idArchivo) => {
    const sql = `
      SELECT 
        idArchivo,
        entidad,
        idEntidad,
        keyFile,
        filename,
        url,
        contentType,
        size,
        estadoId,
        creadoEn,
        creadoPor,
        actualizadoEn,
        actualizadoPor
      FROM archivos
      WHERE idArchivo = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [idArchivo]);
    return rows[0] || null;
  },

  updateEstado: async ({ idArchivo, estadoId, actualizadoPor }) => {
    const sql = `
      UPDATE archivos
      SET estadoId = ?,
          actualizadoPor = ?,
          actualizadoEn = NOW()
      WHERE idArchivo = ?
    `;
    await pool.query(sql, [estadoId, actualizadoPor, idArchivo]);
    return true;
  },

  updateNombre: async ({ idArchivo, filename, actualizadoPor }) => {
    const sql = `
      UPDATE archivos
      SET filename = ?,
          actualizadoPor = ?,
          actualizadoEn = NOW()
      WHERE idArchivo = ?
    `;
    await pool.query(sql, [filename, actualizadoPor, idArchivo]);
    return true;
  },
  async findByEntity(entidad, idEntidad) {
    const sql = `
      SELECT
        idArchivo,
        entidad,
        idEntidad,
        keyFile,
        filename,
        url,
        contentType,
        size,
        estadoId,
        creadoPor,
        creadoEn
      FROM archivos
      WHERE entidad = ? AND idEntidad = ?
      ORDER BY creadoEn DESC
    `;
    const [rows] = await pool.query(sql, [entidad, idEntidad]);
    return rows;
  },
  async findByReserva(idReserva) {
    const [rows] = await pool.query(`
      SELECT filename, url, creadoEn
      FROM archivos
      WHERE entidad = 'RESERVA'
        AND idEntidad = ?
      ORDER BY creadoEn ASC
    `, [idReserva]);
  
    return rows;
  }

};
