import pool from '../../../keys.js';

export const usersRepository = {
  // ===========================
  // Obtener todos (dashboard)
  // ===========================
  findAllPaginated: async ({ search, page, limit, type }) => {
    const offset = (page - 1) * limit;
    const params = [];
    let where = "WHERE 1=1";
  
    if (search) {
      where = `
        WHERE 
          u.nombres LIKE ? OR
          u.apellidos LIKE ? OR
          u.correo LIKE ? OR
          u.telefono LIKE ?
      `;
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (type === "clients") {
      // Since roles not implemented, filter by idRol=1 for clients
      where += ` AND u.idRol = 1`;
    }
    else if (type === "dashboard") {
      // Since roles not implemented, filter by idRol!=1 for dashboard
      where += ` AND u.idRol != 1`;
    }
  
    const sqlData = `
      SELECT 
        u.idUsuario,
        u.nombres,
        u.apellidos,
        u.correo,
        u.telefono,
        1 AS idRol,
        u.estadoId,
        'Usuario' AS rolNombre,
        'USER' AS rolCodigo,
        u.creadoEn,
        u.actualizadoEn
      FROM usuarios u
      ${where}
      ORDER BY u.idUsuario DESC
      LIMIT ? OFFSET ?
    `;
  
    const sqlCount = `
    SELECT COUNT(*) AS total
    FROM usuarios u
    ${where}
  `;
  
    const [rows] = await pool.query(sqlData, [...params, limit, offset]);
    const [countRows] = await pool.query(sqlCount, params);
  
    return {
      data: rows,
      total: countRows[0].total
    };
  },

  // ===========================
  // Insertar usuario
  // ===========================
  create: async ({ nombres, apellidos, telefono, correo, hash, creadoPor }, conn = null) => {
    const db = conn ?? pool;
    const sql = `
      INSERT INTO usuarios (
        nombres, apellidos, telefono, correo,
        contraseniaHash, estadoId, creadoPor
      ) VALUES (?, ?, ?, ?, ?, 1, ?)
    `;

    const [result] = await db.query(sql, [
      nombres, apellidos, telefono, correo, hash, creadoPor
    ]);

    return result.insertId;
  },

  // ===========================
  // Buscar por ID
  // ===========================
  findById: async (idUsuario) => {
    const sql = `
      SELECT * FROM usuarios
      WHERE idUsuario = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [idUsuario]);
    return rows[0] || null;
  },

  // ===========================
  // Actualizar usuario
  // ===========================
  update: async ({ idUsuario, nombres, apellidos, telefono, idRol, actualizadoPor }) => {
    const sql = `
      UPDATE usuarios
      SET nombres = ?, apellidos = ?, telefono = ?, idRol = ?, actualizadoPor = ?
      WHERE idUsuario = ?
    `;

    await pool.query(sql, [nombres, apellidos, telefono, idRol, actualizadoPor, idUsuario]);
  },

  updatePorfile: async ({ idUsuario, nombres, apellidos, telefono, actualizadoPor }) => {
    const sql = `
      UPDATE usuarios
      SET
        nombres = ?,
        apellidos = ?,
        telefono = ?,
        actualizadoPor = ?,
        actualizadoEn = NOW()
      WHERE idUsuario = ?
      `;

    await pool.query(sql, [nombres, apellidos, telefono, actualizadoPor, idUsuario]);
  },
  

  // ===========================
  // Cambiar estado
  // ===========================
  changeStatus: async (idUsuario, estadoId, userUpdId) => {
    const sql = `
      UPDATE usuarios
      SET estadoId = ?, actualizadoPor = ?
      WHERE idUsuario = ?
    `;
    await pool.query(sql, [estadoId, userUpdId, idUsuario]);
  },

  changePassword: async (idUsuario, password, userUpdId) => {
    const sql = `
      UPDATE usuarios
      SET contraseniaHash = ?, actualizadoPor = ?
      WHERE idUsuario = ?
    `;
    await pool.query(sql, [password, userUpdId, idUsuario]);
  },

  // ===========================
  // Verificar correo duplicado
  // ===========================
  existsMail: async (correo, conn = null) => {
    const db = conn ?? pool;
    const sql = `
      SELECT idUsuario
      FROM usuarios
      WHERE correo = ?
      LIMIT 1
    `;
    const [rows] = await db.query(sql, [correo]);
    return rows.length > 0;
  },
  async findAdmins() {
    const sql = `
      SELECT 
        u.idUsuario,
        u.nombres,
        u.apellidos,
        u.correo
      FROM usuarios u
      WHERE u.idRol = 2
        AND u.estadoId = 1
    `;
  
    const [rows] = await pool.query(sql);
    return rows;
  }
};