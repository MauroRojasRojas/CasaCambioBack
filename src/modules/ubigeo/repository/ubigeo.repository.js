import pool from '../../../keys.js';

export const ubigeoRepository = {
  // Departamentos
  async getAllDepartamentos() {
    const query = 'SELECT id, nombre FROM departamento ORDER BY nombre';
    const [rows] = await pool.execute(query);
    return rows;
  },

  // Provincias
  async getAllProvincias() {
    const query = 'SELECT id, nombre, departamento_id FROM provincia ORDER BY nombre';
    const [rows] = await pool.execute(query);
    return rows;
  },

  async getProvinciasByDepartamento(departamentoId) {
    const query = 'SELECT id, nombre, departamento_id FROM provincia WHERE departamento_id = ? ORDER BY nombre';
    const [rows] = await pool.execute(query, [departamentoId]);
    return rows;
  },

  // Distritos
  async getAllDistritos() {
    const query = 'SELECT id, nombre, provincia_id FROM distrito ORDER BY nombre';
    const [rows] = await pool.execute(query);
    return rows;
  },

  async getDistritosByProvincia(provinciaId) {
    const query = 'SELECT id, nombre, provincia_id FROM distrito WHERE provincia_id = ? ORDER BY nombre';
    const [rows] = await pool.execute(query, [provinciaId]);
    return rows;
  }
};