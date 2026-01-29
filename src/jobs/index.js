import cron from "node-cron";
import { expireReservationsJob } from "./reservas-expire.job.js";

export function initJobs() {
  // Cada minuto (producción: cada 5 min está bien)
  cron.schedule("*/1 * * * *", async () => {
    console.log("⏳ Ejecutando job de expiración de reservas...");
    await expireReservationsJob();
  });
}