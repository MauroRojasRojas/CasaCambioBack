import { AppError } from '../../../core/errors/app-error.js';
import { sendContactUsEmail } from '../../../core/mail/mail.service.js';

function escapeHtml(s = '') {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export const contactUsService = {
  send: async (data) => {
    try {
      const to = process.env.COMPLAINTS_TO; // ✅ usamos el mismo
      if (!to) {
        throw new AppError('COMPLAINTS_TO no configurado', 500, 'CONFIG_ERROR');
      }

      const fecha = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

      const payload = {
        to,
        subject: `Contáctanos: ${data.subject}`,
        fecha,
        name: escapeHtml(data.name),
        email: escapeHtml(data.email),
        subjectText: escapeHtml(data.subject),
        message: escapeHtml(data.message),
      };

      try {
        await sendContactUsEmail(payload);
      } catch (e) {
        console.log('⚠️ correo contactanos falló:', e.message);
      }

      return { ok: true };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al enviar el mensaje', 500, 'SEND_CONTACTUS_ERROR');
    }
  },
};