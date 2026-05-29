// src/modules/cuentas-internas/repository/cuentas-internas.repository.js
import pool from '../../../keys.js';

export const cuentasInternasRepository = {
  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM cuentas_internas ORDER BY banco ASC'
    );
    return rows;
  },

  async findByMoneda(moneda) {
    const [rows] = await pool.execute(
      'SELECT * FROM cuentas_internas WHERE moneda = ? AND activa = 1 ORDER BY banco ASC',
      [moneda]
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM cuentas_internas WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByNumeroCuenta(numero_cuenta) {
    const [rows] = await pool.execute(
      'SELECT * FROM cuentas_internas WHERE numero_cuenta = ?',
      [numero_cuenta]
    );
    return rows[0] || null;
  },

  async create({ banco, tipo_cuenta, numero_cuenta, cci, moneda }) {
    const [result] = await pool.execute(
      `INSERT INTO cuentas_internas 
       (banco, tipo_cuenta, numero_cuenta, cci, moneda, activa, creado_en, actualizado_en)
       VALUES (?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [banco, tipo_cuenta, numero_cuenta, cci || null, moneda]
    );
    return result.insertId;
  },

  async update(id, { banco, tipo_cuenta, numero_cuenta, cci, moneda, activa }) {
    const [result] = await pool.execute(
      `UPDATE cuentas_internas SET 
        banco = ?, 
        tipo_cuenta = ?, 
        numero_cuenta = ?, 
        cci = ?, 
        moneda = ?, 
        activa = ?, 
        actualizado_en = NOW()
       WHERE id = ?`,
      [banco, tipo_cuenta, numero_cuenta, cci || null, moneda, activa, id]
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM cuentas_internas WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async toggleActiva(id) {
    const [result] = await pool.execute(
      `UPDATE cuentas_internas 
       SET activa = 1 - activa, actualizado_en = NOW() 
       WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};
