import pool from '../../../keys.js';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS bancos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    logo VARCHAR(500) NOT NULL,
    visible TINYINT(1) DEFAULT 1,
    disponible TINYINT(1) DEFAULT 1,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

(async () => {
  try {
    await pool.execute(CREATE_TABLE_SQL);
    console.log('✅ Tabla "bancos" verificada/creada correctamente');
  } catch (err) {
    console.error('❌ Error al verificar/crear tabla bancos:', err.message);
  }
})();

export const bancosRepository = {
  async findAllPublic() {
    const [rows] = await pool.execute(
      'SELECT * FROM bancos WHERE visible = 1 ORDER BY orden ASC'
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM bancos ORDER BY orden ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM bancos WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ nombre, logo, visible, disponible, orden }) {
    const [result] = await pool.execute(
      `INSERT INTO bancos (nombre, logo, visible, disponible, orden)
       VALUES (?, ?, ?, ?, ?)`,
      [nombre, logo, visible ?? 1, disponible ?? 1, orden ?? 0]
    );
    return result.insertId;
  },

  async update(id, { nombre, logo, visible, disponible, orden }) {
    const fields = [];
    const values = [];
    if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
    if (logo !== undefined) { fields.push('logo = ?'); values.push(logo); }
    if (visible !== undefined) { fields.push('visible = ?'); values.push(visible); }
    if (disponible !== undefined) { fields.push('disponible = ?'); values.push(disponible); }
    if (orden !== undefined) { fields.push('orden = ?'); values.push(orden); }
    if (fields.length === 0) return false;
    values.push(id);
    const [result] = await pool.execute(
      `UPDATE bancos SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async toggleVisible(id) {
    const [result] = await pool.execute(
      'UPDATE bancos SET visible = 1 - visible WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async toggleDisponible(id) {
    const [result] = await pool.execute(
      'UPDATE bancos SET disponible = 1 - disponible WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM bancos WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};
