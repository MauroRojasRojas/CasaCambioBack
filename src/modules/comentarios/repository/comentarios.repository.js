// src/modules/comentarios/repository/comentarios.repository.js
import pool from '../../../keys.js';

export const comentariosRepository = {
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM comentarios ORDER BY creado_en DESC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM comentarios WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ nombre_cliente, foto_url, comentario, estrellas }) {
    const [result] = await pool.execute(
      `INSERT INTO comentarios 
       (nombre_cliente, foto_url, comentario, estrellas, visible, creado_en, actualizado_en)
       VALUES (?, ?, ?, ?, 1, NOW(), NOW())`,
      [nombre_cliente, foto_url || null, comentario, estrellas]
    );
    return result.insertId;
  },

  async update(id, { nombre_cliente, foto_url, comentario, estrellas, visible }) {
    const [result] = await pool.execute(
      `UPDATE comentarios SET 
        nombre_cliente = ?, 
        foto_url = ?, 
        comentario = ?, 
        estrellas = ?, 
        visible = ?, 
        actualizado_en = NOW()
       WHERE id = ?`,
      [nombre_cliente, foto_url || null, comentario, estrellas, visible ?? 1, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM comentarios WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async toggleVisible(id) {
    const [result] = await pool.execute(
      `UPDATE comentarios 
       SET visible = 1 - visible, actualizado_en = NOW() 
       WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};
