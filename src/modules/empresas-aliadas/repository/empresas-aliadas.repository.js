// src/modules/empresas-aliadas/repository/empresas-aliadas.repository.js
import pool from '../../../keys.js';

export const empresasAliadasRepository = {
  async findAllPublic() {
    const [rows] = await pool.execute(
      'SELECT * FROM empresas_aliadas WHERE activa = 1 ORDER BY nombre ASC'
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM empresas_aliadas ORDER BY nombre ASC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM empresas_aliadas WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ nombre, url_web, logo_url }) {
    const [result] = await pool.execute(
      `INSERT INTO empresas_aliadas (nombre, url_web, logo_url, activa, creado_en, actualizado_en)
       VALUES (?, ?, ?, 1, NOW(), NOW())`,
      [nombre, url_web || null, logo_url]
    );
    return result.insertId;
  },

  async update(id, { nombre, url_web, logo_url, activa }) {
    const fields = [];
    const values = [];

    if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
    if (url_web !== undefined) { fields.push('url_web = ?'); values.push(url_web || null); }
    if (logo_url !== undefined) { fields.push('logo_url = ?'); values.push(logo_url); }
    if (activa !== undefined) { fields.push('activa = ?'); values.push(activa); }

    fields.push('actualizado_en = NOW()');
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE empresas_aliadas SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM empresas_aliadas WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async toggleActiva(id) {
    const [result] = await pool.execute(
      'UPDATE empresas_aliadas SET activa = 1 - activa, actualizado_en = NOW() WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
};
