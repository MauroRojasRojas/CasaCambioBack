import pool from '../../../keys.js';

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    subtitulo VARCHAR(500) DEFAULT NULL,
    resumen TEXT DEFAULT NULL,
    cuerpo LONGTEXT DEFAULT NULL,
    imagen_url VARCHAR(500) DEFAULT NULL,
    categoria ENUM('Tipo de cambio','Economía','Empresa','Promoción','Mercados','Internacional') NOT NULL,
    tamanio ENUM('PEQUENA','MEDIANA','GRANDE') NOT NULL DEFAULT 'PEQUENA',
    posicion_imagen ENUM('ARRIBA','IZQUIERDA','DERECHA','FONDO') NOT NULL DEFAULT 'ARRIBA',
    color_acento VARCHAR(7) DEFAULT '#02254A',
    link_externo VARCHAR(500) DEFAULT NULL,
    animacion ENUM('FADE','SLIDE','ZOOM','NINGUNA') DEFAULT 'NINGUNA',
    en_ticker TINYINT(1) DEFAULT 0,
    activa TINYINT(1) DEFAULT 1,
    orden INT DEFAULT 0,
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
`;

(async () => {
  try {
    await pool.execute(CREATE_TABLE_SQL);
    console.log('✅ Tabla "noticias" verificada/creada correctamente');

    // Verificar si faltan columnas (migración simple)
    const [columns] = await pool.execute('SHOW COLUMNS FROM noticias');
    const columnNames = columns.map(c => c.Field);
    
    const missingColumns = [
      { name: 'color_acento', type: "VARCHAR(7) DEFAULT '#02254A'" },
      { name: 'link_externo', type: 'VARCHAR(500) DEFAULT NULL' },
      { name: 'animacion', type: "ENUM('FADE','SLIDE','ZOOM','NINGUNA') DEFAULT 'NINGUNA'" },
      { name: 'en_ticker', type: 'TINYINT(1) DEFAULT 0' },
      { name: 'orden', type: 'INT DEFAULT 0' }
    ];

    for (const col of missingColumns) {
      if (!columnNames.includes(col.name)) {
        console.log(`Adding missing column ${col.name} to noticias table...`);
        await pool.execute(`ALTER TABLE noticias ADD COLUMN ${col.name} ${col.type}`);
      }
    }
  } catch (err) {
    console.error('❌ Error al verificar/crear tabla noticias:', err.message);
  }
})();

function toMySQLDate(val) {
  if (!val) return new Date().toISOString().slice(0, 19).replace('T', ' ');
  const d = new Date(val);
  if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 19).replace('T', ' ');
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

export const noticiasRepository = {
  async findAllPublic() {
    const [rows] = await pool.execute(
      'SELECT * FROM noticias WHERE activa = 1 ORDER BY orden ASC, fecha_publicacion DESC'
    );
    return rows;
  },

  async findTicker() {
    const [rows] = await pool.execute(
      'SELECT * FROM noticias WHERE activa = 1 AND en_ticker = 1 ORDER BY orden ASC, fecha_publicacion DESC'
    );
    return rows;
  },

  async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM noticias ORDER BY orden ASC, fecha_publicacion DESC'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM noticias WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create(data) {
    const fecha = toMySQLDate(data.fecha_publicacion);
    const [result] = await pool.execute(
      `INSERT INTO noticias 
       (titulo, subtitulo, resumen, cuerpo, imagen_url, categoria, tamanio, posicion_imagen, color_acento, link_externo, animacion, en_ticker, activa, orden, fecha_publicacion, creado_en, actualizado_en)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        data.titulo,
        data.subtitulo || null,
        data.resumen || null,
        data.cuerpo || null,
        data.imagen_url || null,
        data.categoria,
        data.tamanio,
        data.posicion_imagen,
        data.color_acento || '#02254A',
        data.link_externo || null,
        data.animacion || 'NINGUNA',
        data.en_ticker ?? 1,
        data.activa ?? 1,
        data.orden ?? 0,
        fecha
      ]
    );
    return result.insertId;
  },

  async update(id, data) {
    const fields = [];
    const values = [];

    for (const key of ['titulo', 'subtitulo', 'resumen', 'cuerpo', 'imagen_url', 'categoria', 'tamanio', 'posicion_imagen', 'color_acento', 'link_externo', 'animacion', 'en_ticker', 'activa', 'orden']) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    if (data.fecha_publicacion !== undefined) {
      fields.push('fecha_publicacion = ?');
      values.push(toMySQLDate(data.fecha_publicacion));
    }

    if (fields.length === 0) return false;

    fields.push('actualizado_en = NOW()');
    values.push(id);

    const [result] = await pool.execute(
      `UPDATE noticias SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    return result.affectedRows > 0;
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM noticias WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },

  async toggleActiva(id) {
    const [result] = await pool.execute(
      `UPDATE noticias SET activa = 1 - activa, actualizado_en = NOW() WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }
};
