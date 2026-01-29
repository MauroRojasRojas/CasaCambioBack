import pool from '../../../keys.js';

export const authRepository = {

  findUserById: async (idUsuario) => {
    const sql = `
      SELECT 
        u.idUsuario,
        u.nombres,
        u.apellidos,
        u.telefono,
        u.correo,
        u.contraseniaHash,
        u.idRol,
        u.estadoId,
        u.perfilCompleto,
        r.nombre AS rolNombre,
        r.codigoSistema AS rolCodigo,
        u.creadoEn
      FROM usuarios u
      INNER JOIN roles r ON r.idRol = u.idRol
      WHERE u.idUsuario = ?
      LIMIT 1;
    `;

    const [rows] = await pool.query(sql, [idUsuario]);
    return rows[0] || null;
  },
  
  findUserByMail: async (correo) => {
    const sql = `
      SELECT
        u.idUsuario,
        u.nombres,
        u.apellidos,
        u.telefono,
        u.correo,
        u.contraseniaHash,
        u.idRol,
        u.perfilCompleto,
        u.estadoId,
        u.emailVerificado,
        u.authProvider,
        u.creadoEn,
        r.nombre AS rolNombre,
        r.codigoSistema AS rolCodigo
      FROM usuarios u
      INNER JOIN roles r ON r.idRol = u.idRol
      WHERE u.correo = ?
      LIMIT 1
    `;
  console.log('pool', pool)
    const [rows] = await pool.query(sql, [correo]);
    return rows[0] || null;
  },

  findRolById: async (idRol) => {
    const sql = `
      SELECT
        idRol,
        nombre,
        descripcion,
        codigoSistema,
        activo
      FROM roles
      WHERE idRol = ?
      LIMIT 1;
    `;

    const [rows] = await pool.query(sql, [idRol]);
    return rows[0] || null;
  },

  getModulosPermitidos: async (idRol) => {
    const sql = `
      SELECT m.codigoSistema
      FROM rolmodulo rm
      INNER JOIN modulos m ON m.idModulo = rm.idModulo
      WHERE rm.idRol = ?
      ORDER BY m.orden ASC;
    `;

    const [rows] = await pool.query(sql, [idRol]);
    return rows.map(r => r.codigoSistema);
  },

  async verifyPermission({ dni, modulo, codEntidad, routerLink }) {
     const moduleConfig = MODULES[modulo]; // ← VIENE DEL TOKEN (CONFIABLE)
    const { database, userModuleTable, userTable } = moduleConfig;

    const sql = `
            SELECT m.RouterLink
            FROM ${database}.${userModuleTable} um
            INNER JOIN ${database}.${userTable} u ON um.CodUsuario = u.Dni
            INNER JOIN ${database}.modulo m ON m.Codigo = um.CodModulo
            WHERE um.CodUsuario = ?
              AND u.CodEntidad = ?
              AND m.Estado = 1
              AND m.RouterLink = ?
            LIMIT 1
        `;

    const [rows] = await pool.query(sql, [dni, codEntidad, routerLink]);
    return rows.length > 0;
  },

  async getModulosPermitidosByCodigoRol(codigoSistemaRol) {
    const sql = `
      SELECT m.codigoSistema
      FROM roles r
      INNER JOIN rolmodulo rm ON rm.idRol = r.idRol
      INNER JOIN modulos m ON m.idModulo = rm.idModulo
      WHERE r.codigoSistema = ?
      ORDER BY m.orden ASC
    `;
  
    const [rows] = await pool.query(sql, [codigoSistemaRol]);
  
    // Devuelve un array así: ["MOD_USERS", "MOD_RESERVAS", "MOD_HABITACIONES"]
    return rows.map(item => item.codigoSistema);
  },

  async findUserByMailAllStates(correo) {
    const sql = `
      SELECT idUsuario, correo, contraseniaHash, estadoId, idRol, emailVerificado, perfilCompleto, authProvider, creadoEn
      FROM usuarios
      WHERE correo = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [correo]);
    return rows[0] || null;
  },

  async createPendingUser({ correo, passwordHash, authProvider }) {
    const sql = `
      INSERT INTO usuarios (
        correo,
        contraseniaHash,
        idRol,
        estadoId,
        emailVerificado,
        perfilCompleto,
        authProvider,
        creadoEn
      )
      VALUES (?, ?, 4, 1, 0, 0, ?, NOW())
    `;
    const [result] = await pool.query(sql, [
      correo,
      passwordHash,
      authProvider
    ]);
    return result.insertId;
  },

  async invalidateOtp(idUsuario) {
    const sql = `
      UPDATE usuarioOtp
      SET usedAt = NOW()
      WHERE idUsuario = ? AND usedAt IS NULL
    `;
    await pool.query(sql, [idUsuario]);
  },

  async createOtp({ idUsuario, codeHash }) {
    const sql = `
      INSERT INTO usuarioOtp (idUsuario, codigoHash, expiresAt)
      VALUES (?, ?, DATE_ADD(UTC_TIMESTAMP(), INTERVAL 10 MINUTE))
    `;
    await pool.query(sql, [idUsuario, codeHash]);
  },
  async verifyEmail(idUsuario) {
    const sql = `
      UPDATE usuarios
      SET emailVerificado = 1
      WHERE idUsuario = ?
    `;
    await pool.query(sql, [idUsuario]);
  },
  // Buscar usuario sin filtrar perfil
  async findUserByMailAllStatesProfile(correo) {
    const sql = `
      SELECT idUsuario, correo, estadoId, perfilCompleto, idRol, emailVerificado, authProvider, creadoEn
      FROM usuarios
      WHERE correo = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [correo]);
    return rows[0] || null;
  },

// Actualizar datos del perfil
  async updateProfile({ idUsuario, nombres, apellidos, telefono }) {
    const sql = `
      UPDATE usuarios
      SET
        nombres = ?,
        apellidos = ?,
        telefono = ?,
        perfilCompleto = 1
      WHERE idUsuario = ?
    `;
    await pool.query(sql, [nombres, apellidos, telefono, idUsuario]);
  },

  async getLastOtpByUser(idUsuario) {
    const sql = `
      SELECT
        idOtp,
        attempts,
        lockedUntil,
        createdAt
      FROM usuarioOtp
      WHERE idUsuario = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [idUsuario]);
    return rows[0] || null;
  },

  async findValidOtp({ idUsuario, codeHash }) {
    const sql = `
      SELECT
        idOtp,
        attempts
      FROM usuarioOtp
      WHERE idUsuario = ?
        AND codigoHash = ?
        AND usedAt IS NULL
        AND expiresAt > UTC_TIMESTAMP()
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [idUsuario, codeHash]);
    return rows[0] || null;
  },

  async incrementOtpAttempts(idUsuario) {
    const sql = `
      UPDATE usuarioOtp
      SET attempts = attempts + 1
      WHERE idUsuario = ?
        AND usedAt IS NULL
    `;
    await pool.query(sql, [idUsuario]);
  },

  async lockOtpUser(idUsuario) {
    const sql = `
      UPDATE usuarioOtp
      SET lockedUntil = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR)
      WHERE idUsuario = ?
        AND usedAt IS NULL
    `;
    await pool.query(sql, [idUsuario]);
  },
  async markOtpAsUsed(idOtp) {
    const sql = `
      UPDATE usuarioOtp
      SET usedAt = NOW()
      WHERE idOtp = ?
    `;
    await pool.query(sql, [idOtp]);
  },
  async resetOtpAttemptsIfUnlocked(idUsuario) {
    const sql = `
      UPDATE usuarioOtp
      SET attempts = 0,
          lockedUntil = NULL
      WHERE idUsuario = ?
        AND lockedUntil IS NOT NULL
        AND lockedUntil <= NOW()
    `;
    await pool.query(sql, [idUsuario]);
  },
  async clearOtpSecurity(idUsuario) {
    await pool.query(`
      UPDATE usuarioOtp
      SET attempts = 0, lockedUntil = NULL
      WHERE idUsuario = ?
    `, [idUsuario]);
  },

  async saveRefreshToken({ idUsuario, refreshToken, expiresInDays }) {
    await pool.query(`
      INSERT INTO usuario_refresh_token
      (idUsuario, refreshToken, expiresAt)
      VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))
    `, [idUsuario, refreshToken, expiresInDays]);
  },
  async findRefreshToken(refreshToken) {
    const [rows] = await pool.query(`
      SELECT *
      FROM usuario_refresh_token
      WHERE refreshToken = ?
      LIMIT 1
    `, [refreshToken]);
  
    return rows[0];
  },
  async revokeRefreshToken(refreshToken) {
    await pool.query(`
      UPDATE usuario_refresh_token
      SET isRevoked = 1,
          revokedAt = NOW()
      WHERE refreshToken = ?
        AND isRevoked = 0
    `, [refreshToken]);
  },
  async updatePassword(idUsuario, passwordHash) {
    await pool.query(
      `
      UPDATE usuarios
      SET contraseniaHash = ?
      WHERE idUsuario = ?
      `,
      [passwordHash, idUsuario]
    );
  },
  async revokeAllRefreshTokensByUser(idUsuario) {
    await pool.query(
      `
      UPDATE usuario_refresh_token
      SET 
        isRevoked = 1,
        revokedAt = NOW()
      WHERE idUsuario = ?
        AND isRevoked = 0
      `,
      [idUsuario]
    );
  }
  
};
