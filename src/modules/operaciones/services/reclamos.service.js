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

      const payload = {
        to,
        subject: `Libro de Reclamaciones: ${tipo} - OPERACIÓN ${data.operationNumber}`,
        fecha,
        tipo,

        email: escapeHtml(data.email),
        alternateEmail: data.alternateEmail
          ? escapeHtml(data.alternateEmail)
          : "—",

        nombres: escapeHtml(data.firstName),
        apellidos: escapeHtml(
          [data.fatherSurname, data.motherSurname].filter(Boolean).join(" ")
        ),

        documentType: escapeHtml(data.documentType),
        documentNumber: escapeHtml(data.documentNumber),

        phone: escapeHtml(data.phone),
        additionalPhone: data.additionalPhone
          ? escapeHtml(data.additionalPhone)
          : "—",

        address: escapeHtml(data.address),
        district: escapeHtml(data.district),
        province: escapeHtml(data.province),
        department: escapeHtml(data.department),

        service: escapeHtml(data.service),
        operationNumber: escapeHtml(data.operationNumber),

        amountSent: data.amountSoles
          ? escapeHtml(String(data.amountSoles))
          : "0.00",

        amountReceived: data.amountDollars
          ? escapeHtml(String(data.amountDollars))
          : "0.00",

        detail: escapeHtml(data.detail),
        request: escapeHtml(data.request),
      };

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
