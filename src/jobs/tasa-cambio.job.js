import { tasasCambioService } from "../modules/tasas-cambio/services/tasas-cambio.service.js";

/**
 * Job que actualiza la tasa de cambio USD/PEN desde la API externa
 * Se ejecuta cada 10 minutos
 */
export async function actualizarTasaCambioJob() {
  try {
    console.log("💱 Actualizando tasa de cambio USD/PEN...");
    
    const tasa = await tasasCambioService.fetchAndSaveTasaCambio();
    
    console.log(`💱 Tasa actualizada: Compra=${tasa.tasa_compra} PEN, Venta=${tasa.tasa_venta} PEN`);
  } catch (error) {
    console.error("❌ Error en actualizarTasaCambioJob:", error.message);
  }
}
