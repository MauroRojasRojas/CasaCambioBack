import { tasasCambioService } from "../modules/tasas-cambio/services/tasas-cambio.service.js";

/**
 * Job que actualiza la tasa de cambio USD/PEN desde la API externa
 * Se ejecuta cada 10 minutos
 */
export async function actualizarTasaCambioJob() {
  try {
    console.log("💱 Actualizando tasa de cambio USD/PEN...");
    
    const tasa = await tasasCambioService.fetchAndSaveTasaCambio();
    
    console.log(`💱 Tasa actualizada: Compra USD=${tasa.tasa_compra_usd} PEN, Venta USD=${tasa.tasa_venta_usd} PEN`);
  } catch (error) {
    console.error("❌ Error en actualizarTasaCambioJob:", error.message);
  }
}
