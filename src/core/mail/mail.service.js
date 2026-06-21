import nodemailer from "nodemailer";
import { AppError } from "../errors/app-error.js"
import { adminReservaEnRevisionTemplate, complaintTemplate, contactUsTemplate, operacionConstanciaTemplate, otpTemplate, pagoConfirmadoTemplate, preReservaTemplate, recoveryTemplate, reservaConfirmadaTemplate, welcomeTemplate } from "./mail.templates.js";
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

export async function sendWelcomeEmail({ to, nombre }) {
  try {
    const send = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to,
      subject: "¡Bienvenido/a! Tu cuenta fue creada",
      html: welcomeTemplate({
        nombre,
        correo: to,
        loginUrl: `${process.env.FRONT_URL}/login`, // ajusta si tu ruta es otra
      }),
    });
    console.log('SENDDD', send)
  } catch (error) {
    console.error("RESEND ERROR (WELCOME):", error);
    throw new AppError("Error al enviar correo de bienvenida", 500, "MAIL_SEND_FAILED");
  }
}

export async function sendPagoConfirmadoEmail(payload) {
  try {
    const panelUrl = `${process.env.FRONT_URL}/login`;
    const frontUrl = process.env.FRONT_URL;

    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: payload.to,
      subject: `¡Pago realizado! - ${payload.codigoOperacion}`,
      html: pagoConfirmadoTemplate({ ...payload, panelUrl, frontUrl }),
    });

    console.log(`✅ Correo de pago confirmado enviado a ${payload.to}`);
  } catch (error) {
    console.error("RESEND ERROR (PAGO CONFIRMADO):", error);
    throw new AppError("Error al enviar correo de confirmación de pago", 500, "MAIL_SEND_FAILED");
  }
}

export async function sendOperacionConstanciaEmail(payload) {
  try {
    const loginUrl = `${process.env.FRONT_URL}/login`;
    const frontUrl = process.env.FRONT_URL;

    console.log('payload',payload)
  
    const reset = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: payload.to,
      subject: `Constancia de operación - ${payload.codigoOperacion}`,
      html: operacionConstanciaTemplate({ ...payload, loginUrl, frontUrl }),
    });
    console.log('resett',reset)

  }catch (error) {
    console.error("RESEND ERROR (OPERACION CONSTANCIA):", error);
    throw new AppError("Error al enviar correo de constancia de operación", 500, "MAIL_SEND_FAILED");
  }
}

export async function sendComplaintEmail(payload) {
  try {
    const send = await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html: complaintTemplate(payload),
    });
    return send;
  } catch (error) {
    console.error("RESEND ERROR (COMPLAINT):", error);
    throw new AppError("Error al enviar correo de reclamo", 500, "MAIL_SEND_FAILED");
  }
}

export async function sendContactUsEmail(payload) {
  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      html: contactUsTemplate(payload),
    });
  } catch (error) {
    console.error('RESEND ERROR (CONTACTUS):', error);
    throw new AppError('Error al enviar correo de contáctanos', 500, 'MAIL_SEND_FAILED');
  }
}