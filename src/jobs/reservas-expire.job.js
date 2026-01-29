import pool from "../keys.js";

export async function expireReservationsJob() {
  try {
    console.log('IMPLEMENTAR METODO QUE EN CASO NO SUBA SU COMPROBANTE, SE CANCELE EN 20 MINUTOS');
    
    /* const sql = `
      UPDATE reservas
      SET estadoId = 5, -- CANCELADA
          canceladoEn = NOW()
      WHERE estadoId = 1 -- PRE_RESERVA
        AND expiresAt IS NOT NULL
        AND expiresAt <= NOW()
    `;

    const [result] = await pool.query(sql);

    if (result.affectedRows > 0) {
      console.log(
        `⏰ Reservas expiradas automáticamente: ${result.affectedRows}`
      );
    } */
  } catch (error) {
    console.error("❌ Error en expireReservationsJob", error);
  }
}
