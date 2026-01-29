import pool from '../../../keys.js';

export const passwordResetRepository = {
  async invalidatePasswordResets(idUsuario) {
    await pool.query(`
      UPDATE usuario_password_reset
      SET usedAt = NOW()
      WHERE idUsuario = ?
        AND usedAt IS NULL
    `, [idUsuario]);
  },
  
  async createPasswordReset({ idUsuario, tokenHash }) {
    await pool.query(`
      INSERT INTO usuario_password_reset
        (idUsuario, tokenHash, expiresAt)
      VALUES
        (?, ?, DATE_ADD(NOW(), INTERVAL 30 MINUTE))
    `, [idUsuario, tokenHash]);
  },
  
  async getLastPasswordReset(idUsuario) {
    const [rows] = await pool.query(`
      SELECT idReset, attempts, lockedUntil, createdAt
      FROM usuario_password_reset
      WHERE idUsuario = ?
      ORDER BY createdAt DESC
      LIMIT 1
    `, [idUsuario]);
  
    return rows[0] || null;
  },

  async countRecentPasswordResets(idUsuario, minutes) {
    const [rows] = await pool.query(`
      SELECT COUNT(*) AS total
      FROM usuario_password_reset
      WHERE idUsuario = ?
        AND createdAt > DATE_SUB(NOW(), INTERVAL ? MINUTE)
    `, [idUsuario, minutes]);
  
    return rows[0]?.total || 0;
  },
  
  async findValidPasswordReset(tokenHash) {
    const [rows] = await pool.query(`
      SELECT idReset, idUsuario, attempts
      FROM usuario_password_reset
      WHERE tokenHash = ?
        AND usedAt IS NULL
        AND expiresAt > NOW()
      LIMIT 1
    `, [tokenHash]);
  
    return rows[0] || null;
  },
  
  async incrementPasswordResetAttempts(idReset) {
    await pool.query(`
      UPDATE usuario_password_reset
      SET attempts = attempts + 1
      WHERE idReset = ?
    `, [idReset]);
  },
  
  async lockPasswordReset(idReset) {
    await pool.query(`
      UPDATE usuario_password_reset
      SET lockedUntil = DATE_ADD(NOW(), INTERVAL 1 HOUR)
      WHERE idReset = ?
    `, [idReset]);
  },
  
  async markPasswordResetUsed(idReset) {
    await pool.query(`
      UPDATE usuario_password_reset
      SET usedAt = NOW()
      WHERE idReset = ?
    `, [idReset]);
  },
  
  async resetPasswordResetIfUnlocked(idUsuario) {
    await pool.query(`
      UPDATE usuario_password_reset
      SET attempts = 0, lockedUntil = NULL
      WHERE idUsuario = ?
        AND lockedUntil IS NOT NULL
        AND lockedUntil <= NOW()
    `, [idUsuario]);
  },
};
