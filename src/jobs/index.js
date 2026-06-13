import cron from "node-cron";
import { expireReservationsJob } from "./reservas-expire.job.js";
import { actualizarTasaCambioJob } from "./tasa-cambio.job.js";

export function initJobs() {
  // Cada minuto (producción: cada 5 min está bien)
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏳ Ejecutando job de expiración de reservas...");
    await expireReservationsJob();
  });

  // Cada 1 minuto: Actualizar tasa de cambio USD/PEN (la API externa se actualiza cada 60s)
  cron.schedule("*/1 * * * *", async () => {
    await actualizarTasaCambioJob();
  });

  // Ejecutar inmediatamente al iniciar para tener una tasa inicial
  actualizarTasaCambioJob();
}