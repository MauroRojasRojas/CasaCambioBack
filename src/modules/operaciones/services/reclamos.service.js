// modules/reclamos/services/reclamos.service.js
import { AppError } from "../../../core/errors/app-error.js";
import { sendComplaintEmail } from "../../../core/mail/mail.service.js";

function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export const reclamosService = {
  // ===========================
  // Enviar reclamo por correo
  // ===========================
  send: async (data) => {
    try {
      const to = process.env.COMPLAINTS_TO;
      if (!to) {
        throw new AppError("COMPLAINTS_TO no configurado", 500, "CONFIG_ERROR");
      }

      const fecha = new Date().toLocaleString("es-PE", {
  timeZone: "America/Lima",
});
      const tipo = data.complaintType === "reclamo" ? "RECLAMO" : "QUEJA";

      // armamos payload para template
      const payload = {
        to,
        subject: `Libro de Reclamaciones: ${tipo} - OPERACIÓN ${data.operationNumber}`,
        fecha,
        tipo,
        email: escapeHtml(data.email),

        nombres: escapeHtml(data.firstName),
        apellidos: escapeHtml(`${data.fatherSurname} ${data.motherSurname}`),

        documentType: escapeHtml(data.documentType),
        documentNumber: escapeHtml(data.documentNumber),

        phone: escapeHtml(data.phone),
        address: escapeHtml(data.address),
        district: escapeHtml(data.district),
        province: escapeHtml(data.province),
        department: escapeHtml(data.department),

        service: escapeHtml(data.service),
        operationNumber: escapeHtml(data.operationNumber),

        amountSoles:
          data.amountSoles != null
            ? `S/ ${Number(data.amountSoles).toFixed(2)}`
            : "—",
        amountDollars:
          data.amountDollars != null
            ? `$ ${Number(data.amountDollars).toFixed(2)}`
            : "—",

        // textareas (escapados)
        detail: escapeHtml(data.detail),
        request: escapeHtml(data.request),
      };

      // correo no bloqueante (igual a tu patrón)
      try {
        await sendComplaintEmail(payload);
      } catch (e) {
        console.log("⚠️ correo reclamo falló:", e.message);
      }

      return { ok: true };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error al enviar el reclamo",
        500,
        "SEND_RECLAMO_ERROR",
      );
    }
  },
};
