import pool from '../../../keys.js';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS redes_sociales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    red ENUM('Instagram','TikTok','Facebook','Twitter','YouTube','LinkedIn','WhatsApp','Telegram') NOT NULL UNIQUE,
    url VARCHAR(500) NOT NULL,
    activa TINYINT(1) DEFAULT 0,
    orden INT DEFAULT 0,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

(async () => {
  try {
    await pool.execute(CREATE_TABLE_SQL);
    console.log('✅ Tabla "redes_sociales" verificada/creada correctamente');
  } catch (err) {
    console.error('❌ Error al verificar/crear tabla redes_sociales:', err.message);
  }
})();

export const redesSocialesRepository = {
  async findAllPublic() {
    const [rows] = await pool.execute(
      'SELECT * FROM redes_sociales WHERE activa = 1 ORDER BY orden ASC'
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM redes_sociales ORDER BY orden ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM redes_sociales WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async upsert({ red, url, activa, orden }) {
    const [result] = await pool.execute(
      `INSERT INTO redes_sociales (red, url, activa, orden, creado_en, actualizado_en)
       VALUES (?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE url = VALUES(url), activa = VALUES(activa), orden = VALUES(orden), actualizado_en = NOW()`,
      [red, url, activa ?? 1, orden ?? 0]
    );
    if (result.insertId) return result.insertId;
    const [rows] = await pool.execute('SELECT id FROM redes_sociales WHERE red = ?', [red]);
    return rows[0]?.id;
  },

  async toggleActiva(id) {
    const [result] = await pool.execute(
      'UPDATE redes_sociales SET activa = 1 - activa, actualizado_en = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM redes_sociales WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};
