import nodemailer from "nodemailer";
import { AppError } from "../errors/app-error.js"
import { adminReservaEnRevisionTemplate, otpTemplate, preReservaTemplate, recoveryTemplate, reservaConfirmadaTemplate } from "./mail.templates.js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html
}) {
  await resend.emails.send({
    from: process.env.MAIL_FROM,
    to,
    subject,
    html,
  });
}


export async function sendOtpEmail({ to, code }) {
  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Código de verificación',
      html: otpTemplate({ code }),
    });
  } catch (error) {
    console.error('RESEND ERROR:', error);
    throw new AppError(
      'Error al enviar correo',
      500,
      'MAIL_SEND_FAILED'
    );
  }
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  try {
    const send = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Recuperación de contraseña',
      html: recoveryTemplate({ resetUrl }),
    });
    console.log('SENDDD', send)
  } catch (error) {
    console.error('RESEND ERROR:', error);
    throw new AppError(
      'Error al enviar correo',
      500,
      'MAIL_SEND_FAILED'
    );
  }
}

export async function sendPreReservaEmail({
  to,
  nombre,
  codigoReserva,
  fechaEntrada,
  fechaSalida,
  noches,
  total,
  subtotal,
  igv
}) {
  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Reserva registrada - Pendiente de pago',
      html: preReservaTemplate({
        nombre,
        codigoReserva,
        fechaEntrada,
        fechaSalida,
        noches,
        total,
        subtotal,
        igv,
        reservasUrl: `${process.env.FRONT_URL}/mis-reservas`,
      }),
    });
  } catch (error) {
    console.error('RESEND ERROR:', error);
    throw new AppError(
      'Error al enviar correo de reserva',
      500,
      'MAIL_SEND_FAILED'
    );
  }
}

export async function sendAdminReservaEnRevisionEmail({
  to,
  adminNombre,
  clienteNombre,
  codigoReserva,
  fechaEntrada,
  fechaSalida
}) {
  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Reserva pendiente de confirmación',
      html: adminReservaEnRevisionTemplate({
        adminNombre,
        clienteNombre,
        codigoReserva,
        fechaEntrada,
        fechaSalida,
      }),
    });
  } catch (error) {
    console.error('RESEND ERROR:', error);
    throw new AppError(
      'Error al enviar correo a administrador',
      500,
      'MAIL_SEND_FAILED'
    );
  }
}

export async function sendReservaConfirmadaEmail({
  to,
  nombre,
  codigoReserva,
  fechaEntrada,
  fechaSalida,
  total
}) {
  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject: 'Reserva confirmada - Hotel Geno',
      html: reservaConfirmadaTemplate({
        nombre,
        codigoReserva,
        fechaEntrada,
        fechaSalida,
        total,
      }),
    });
  } catch (error) {
    console.error('RESEND ERROR:', error);
    throw new AppError(
      'Error al enviar correo de confirmación',
      500,
      'MAIL_SEND_FAILED'
    );
  }
}