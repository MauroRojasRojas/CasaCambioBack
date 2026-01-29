import { formatHotelDate } from "../utils/format-date.js"

export function otpTemplate({ code }) {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verificación de correo</h2>
        <p>Usa el siguiente código para confirmar tu cuenta:</p>
  
        <div style="
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 6px;
          margin: 20px 0;
        ">
          ${code}
        </div>
  
        <p>Este código expira en <strong>10 minutos</strong>.</p>
  
        <hr />
        <small>
          Si no solicitaste este código, puedes ignorar este mensaje.
        </small>
      </div>
    `;
  }
  

export function recoveryTemplate({resetUrl}) {
    return `
    <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Recuperación de contraseña</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f6f7f9;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                     Roboto, Helvetica, Arial, sans-serif;
        color: #1f2937;
      }
      .container {
        background: #ffffff;
        border-radius: 8px;
      }
      h1 {
        font-size: 22px;
        margin-bottom: 12px;
        font-weight: 600;
      }
      p {
        font-size: 15px;
        line-height: 1.6;
        margin: 0 0 16px;
        color: #374151;
      }
      .link {
        display: block;
        text-align: start;
        font-size: 16px;
        font-weight: 600;
        margin: 24px 0;
        color: #2563eb;
        word-break: break-all;
        text-decoration: none;
      }
      .expires {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 24px;
      }
      .divider {
        border-top: 1px solid #e5e7eb;
        margin: 24px 0;
      }
      .footer {
        font-size: 13px;
        color: #6b7280;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Recuperación de contraseña</h1>

      <p>
        Solicitaste recuperar tu contraseña.
        Para continuar, abre el siguiente enlace:
      </p>

      <a href="${resetUrl}" class="link">
        Recuperar contraseña
      </a>

      <p class="expires">
        Este enlace es válido por <strong>30 minutos</strong>.
      </p>

      <div class="divider"></div>

      <p class="footer">
        Si no solicitaste este cambio, puedes ignorar este mensaje.
      </p>
    </div>
  </body>
  </html>
    `;
}

export function preReservaTemplate({
  nombre,
  codigoReserva,
  fechaEntrada,
  fechaSalida,
  noches,
  total,
  subtotal,
  igv,
  reservasUrl
}) {
  return `
    <h2>¡Reserva registrada con éxito!</h2>

    <p>Hola <strong>${nombre}</strong>,</p>

    <p>
      Tu reserva en <strong>Hotel Geno</strong> ha sido registrada correctamente.
    </p>

    <p>
      <strong>Estado:</strong> Pendiente de confirmación de pago
    </p>

    <hr />

    <p><strong>Código de reserva:</strong></p>
    <h3>${codigoReserva}</h3>

    <p>
      Para confirmar tu estadía, debes subir el comprobante de pago desde tu panel
      de reservas.
    </p>

    <p>
      <a href="${reservasUrl}"
         style="
           display:inline-block;
           padding:12px 18px;
           background:#14b8a6;
           color:white;
           text-decoration:none;
           border-radius:6px;
           font-weight:bold;
         ">
        Subir comprobante de pago
      </a>
    </p>

    <hr />

    <p>
      <strong>Check-in:</strong> ${fechaEntrada}<br/>
      <strong>Check-out:</strong> ${fechaSalida}<br/>
      <strong>Noches:</strong> ${noches}<br/>
      <br/>
      <strong>Subtotal:</strong> S/ ${subtotal}<br/>
      <strong>IGV (18%):</strong> S/ ${igv}<br/>
      <strong>Total estimado:</strong> 
      <span style="font-weight:600;">S/ ${total}</span>
    </p>

    <p>
      Te esperamos 🌊<br/>
      <strong>Hotel Geno</strong>
    </p>
  `;
}

export function adminReservaEnRevisionTemplate({
  adminNombre,
  clienteNombre,
  codigoReserva,
  fechaEntrada,
  fechaSalida
}) {
  const checkInFormatted = formatHotelDate(fechaEntrada);
  const checkOutFormatted = formatHotelDate(fechaSalida);
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Nueva reserva pendiente de confirmación</h2>

      <p>Hola <strong>${adminNombre}</strong>,</p>

      <p>
        Se ha recibido un comprobante de pago y una reserva
        se encuentra pendiente de revisión.
      </p>

      <hr />

      <p>
        <strong>Cliente:</strong> ${clienteNombre}<br/>
        <strong>Código de reserva:</strong> ${codigoReserva}<br/>
        <strong>Check-in:</strong> ${checkInFormatted}<br/>
        <strong>Check-out:</strong> ${checkOutFormatted}
      </p>

      <p>
        Ingresa al panel de administración para revisar y validar el comprobante.
      </p>

      <hr />

      <small>
        Hotel Geno – Sistema de reservas
      </small>
    </div>
  `;
}

export function reservaConfirmadaTemplate({
  nombre,
  codigoReserva,
  fechaEntrada,
  fechaSalida,
  total
}) {
  const checkInFormatted = formatHotelDate(fechaEntrada);
  const checkOutFormatted = formatHotelDate(fechaSalida);
  return `
    <h2>¡Tu reserva ha sido confirmada! 🎉</h2>

    <p>Hola <strong>${nombre}</strong>,</p>

    <p>
      Nos complace informarte que tu reserva en
      <strong>Hotel Geno</strong> ha sido <strong>confirmada</strong>.
    </p>

    <hr />

    <p><strong>Código de reserva:</strong></p>
    <h3>${codigoReserva}</h3>

    <p>
      <strong>Check-in:</strong> ${checkInFormatted}<br/>
      <strong>Check-out:</strong> ${checkOutFormatted}<br/>
      <strong>Total pagado:</strong>
      <span style="font-weight:600;">S/ ${total}</span>
    </p>

    <p>
      Te esperamos para brindarte una excelente experiencia 🌊🏨
    </p>

    <hr />

    <p>
      <strong>Hotel Geno</strong><br/>
      Equipo de reservas
    </p>
  `;
}
