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

/* export const welcomeTemplate = ({
  nombre = "",
  loginUrl = "https://dollariza.pe/login",
  soporteEmail = "info.dollariza@gmail.com",
  soportePhone = "956-767-180",
}) => `
  <div style="margin:0;padding:0;background:#f5f7fb">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:24px 0;">
      <tr>
        <td align="center" style="padding:0 14px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(2,6,23,0.08);">
            
            <!-- Top bar -->
            <tr>
              <td style="background:linear-gradient(90deg,#0b1b33 0%,#0f2a52 60%,#153a73 100%);padding:22px 22px;">
                <div style="display:flex;align-items:center;gap:12px;">
                  <div style="width:42px;height:42px;border-radius:14px;background:rgba(255,255,255,0.12);display:inline-block;vertical-align:middle;">
                    <!-- Puedes reemplazar por un logo real (img) si quieres -->
                    <div style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-family:Arial,sans-serif;">
                      D$
                    </div>
                  </div>
                  <div style="color:#fff;font-family:Arial,sans-serif;">
                    <div style="font-size:18px;font-weight:800;letter-spacing:0.2px;">Dollariza</div>
                    <div style="font-size:12px;opacity:0.85;">Plataforma segura de cambio online</div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Hero -->
            <tr>
              <td style="padding:22px 22px 0 22px;background:#ffffff;">
                <div style="background:#fff2b3;border:1px solid #ffe28a;border-radius:16px;padding:18px;">
                  <div style="font-family:Arial,sans-serif;color:#0b1b33;">
                    <div style="font-size:18px;font-weight:800;margin-bottom:4px;">
                      ¡Bienvenido${nombre ? `, ${nombre}` : ""}! 👋
                    </div>
                    <div style="font-size:13px;color:#334155;line-height:1.55;">
                      Tu cuenta en <b>Dollariza</b> ya está lista. Desde ahora podrás
                      <b>comprar y vender dólares</b> de manera rápida, segura y con tasas claras.
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:18px 22px 0 22px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:14px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc;">
                      <div style="font-family:Arial,sans-serif;color:#0f172a;">
                        <div style="font-size:14px;font-weight:800;margin:0 0 6px;">¿Qué puedes hacer ahora?</div>
                        <ul style="margin:0;padding-left:18px;color:#334155;font-size:13px;line-height:1.65;">
                          <li>Crear una <b>nueva operación</b> (Compra/Venta USD ↔ PEN).</li>
                          <li>Ver tu <b>Historial de operaciones</b> y descargar constancias.</li>
                          <li>Registrar tus <b>cuentas bancarias</b> para recibir/transferir.</li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td style="padding:18px 22px 8px 22px;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="border-radius:14px;background:#0b1b33;">
                      <a href="${loginUrl}" style="display:inline-block;padding:12px 16px;color:#ffffff;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:800;">
                        Iniciar sesión
                      </a>
                    </td>
                    <td style="width:10px;"></td>
                    <td style="border-radius:14px;background:#fff2b3;border:1px solid #ffe28a;">
                      <a href="https://dollariza.pe" style="display:inline-block;padding:12px 16px;color:#0b1b33;text-decoration:none;font-family:Arial,sans-serif;font-size:13px;font-weight:800;">
                        Ir a Dollariza.pe
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Trust / Note -->
            <tr>
              <td style="padding:6px 22px 0 22px;">
                <div style="font-family:Arial,sans-serif;font-size:12px;color:#64748b;line-height:1.55;">
                  Si tú no creaste esta cuenta, ignora este mensaje.
                </div>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 22px 22px 22px;">
                <div style="border-top:1px solid #e2e8f0;padding-top:14px;font-family:Arial,sans-serif;">
                  <div style="font-size:12px;color:#0f172a;font-weight:800;margin-bottom:6px;">¿Necesitas ayuda?</div>
                  <div style="font-size:12px;color:#334155;line-height:1.7;">
                    Escríbenos a <a href="mailto:${soporteEmail}" style="color:#0b1b33;text-decoration:underline;">${soporteEmail}</a>
                    o contáctanos al <a href="tel:${soportePhone}" style="color:#0b1b33;text-decoration:underline;">${soportePhone}</a>.
                  </div>
                  <div style="margin-top:10px;font-size:11px;color:#94a3b8;">
                    © ${new Date().getFullYear()} Dollariza — Todos los derechos reservados.
                  </div>
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`; */

export const welcomeTemplate = ({
  nombre = "",
  loginUrl = "https://dollariza.pe/login",
  soporteEmail = "info.dollariza@gmail.com",
}) => `
  <div style="font-family:Arial,sans-serif;color:#111827;line-height:1.6;">
    <h2 style="margin:0 0 10px;">Bienvenido${nombre ? `, ${nombre}` : ""}</h2>

    <p style="margin:0 0 10px;">
      Tu cuenta en <b>Dollariza</b> fue creada correctamente.
    </p>

    <p style="margin:0 0 10px;">
      Desde tu panel podrás:
    </p>

    <ul style="margin:0 0 12px;padding-left:18px;">
      <li>Crear operaciones de compra/venta (USD ↔ PEN)</li>
      <li>Ver tu historial de operaciones</li>
      <li>Registrar tus cuentas bancarias</li>
    </ul>

    <p style="margin:0 0 14px;">
      Para ver más detalles, inicia sesión aquí:
      <br />
      <a href="${loginUrl}" style="color:#1d4ed8;text-decoration:underline;">
        ${loginUrl}
      </a>
    </p>

    <hr style="border:none;border-top:1px solid #e5e7eb;margin:14px 0;" />

    <p style="margin:0 0 6px;font-size:12px;color:#6b7280;">
      Si tú no solicitaste esta cuenta, ignora este mensaje.
    </p>

    <p style="margin:0;font-size:12px;color:#6b7280;">
      Soporte: <a href="mailto:${soporteEmail}" style="color:#1d4ed8;">${soporteEmail}</a>
    </p>
  </div>
`;

export const pagoConfirmadoTemplate = ({
  nombre = "",
  codigoOperacion = "",
  fechaEmision = "",
  montoEnviado = "",
  monedaEnviada = "",
  montoRecibido = "",
  monedaRecibida = "",
  tipoOperacion = "",
  tasa = "",
  panelUrl = "https://dollariza.pe/login",
  frontUrl = "https://dollariza.pe",
  soporteEmail = "info.dollariza@gmail.com",
  soportePhone = "956-767-180",
}) => `
  <div style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8FAFC;padding:32px 0;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.08);">

            <!-- ===================== HEADER ===================== -->
            <tr>
              <td style="background:linear-gradient(90deg,#0B1220 0%,#102A56 35%,#123B82 100%);padding:16px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;">
                        <tr>
                          <td style="vertical-align:middle;padding-right:14px;white-space:nowrap;">
                            <table role="presentation" cellspacing="0" cellpadding="0" style="background:#FFFFFF;border-radius:14px;padding:8px;box-shadow:0 8px 20px rgba(0,0,0,0.08);">
                              <tr>
                                <td style="text-align:center;">
                                  <img src="${frontUrl}/icons/logomejorado.png" alt="Dollariza" style="width:44px;height:44px;display:block;border-radius:8px;" />
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="vertical-align:middle;width:100%;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td style="font-size:24px;font-weight:800;color:#FFFFFF;font-family:Arial,sans-serif;letter-spacing:0.2px;line-height:1.2;">Dollariza</td>
                              </tr>
                              <tr>
                                <td style="font-size:11px;font-weight:500;color:rgba(255,255,255,0.85);font-family:Arial,sans-serif;padding-top:1px;">Plataforma segura de cambio online</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- ===================== SUCCESS CARD ===================== -->
            <tr>
              <td style="padding:32px 28px 0 28px;background:#FFFFFF;">
                <div style="background:linear-gradient(135deg,#052E16 0%,#065F46 50%,#064E3B 100%);border-radius:24px;padding:36px 28px;text-align:center;box-shadow:0 20px 40px rgba(0,0,0,0.12);">
                  
                  <!-- Icon circle -->
                  <div style="width:80px;height:80px;border-radius:50%;background:#16A34A;margin:0 auto 20px auto;font-size:44px;font-weight:bold;color:#ffffff;line-height:80px;text-align:center;box-shadow:0 0 30px rgba(22,163,74,0.4);">
                    &#10003;
                  </div>

                  <!-- Title -->
                  <div style="font-family:Arial,sans-serif;color:#FFFFFF;">
                    <div style="font-size:42px;font-weight:800;letter-spacing:-0.5px;line-height:1.1;margin-bottom:16px;">
                      &iexcl;Tu pago fue realizado!
                    </div>
                    <div style="width:60px;height:4px;background:rgba(22,163,74,0.5);border-radius:2px;margin:0 auto 20px auto;"></div>
                    <div style="font-size:16px;font-weight:400;line-height:1.65;color:rgba(255,255,255,0.9);">
                      Hola${nombre ? ` <span style="color:#A3E635;font-weight:700;">${nombre}</span>,` : ""} nos complace informarte que tu operaci&oacute;n
                      ha sido <span style="color:#A3E635;font-weight:700;">transferida exitosamente</span>. El monto ya est&aacute; disponible.
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- ===================== DETAIL CARD ===================== -->
            <tr>
              <td style="padding:28px 28px 0 28px;background:#FFFFFF;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:28px;border:1px solid #E2E8F0;border-radius:20px;background:#FFFFFF;box-shadow:0 10px 25px rgba(15,23,42,0.06);">
                      <div style="font-family:Arial,sans-serif;color:#0F172A;">
                        
                        <!-- Header with icon -->
                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                          <tr>
                            <td style="vertical-align:middle;padding-right:14px;">
                              <div style="width:44px;height:44px;border-radius:12px;background:#DBEAFE;font-size:24px;font-weight:bold;color:#1D4ED8;line-height:44px;text-align:center;">
                                &#10003;
                              </div>
                            </td>
                            <td style="vertical-align:middle;">
                              <div style="font-size:30px;font-weight:700;color:#0F172A;letter-spacing:-0.3px;">Detalle de la operaci&oacute;n</div>
                            </td>
                          </tr>
                        </table>

                        <!-- Data rows -->
                        <table style="width:100%;font-size:15px;color:#0F172A;line-height:1.9;border-collapse:collapse;">
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;width:45%;">Cliente</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${nombre || ""}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">C&oacute;digo</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${codigoOperacion}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Tipo</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${tipoOperacion}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Tasa de cambio</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${tasa}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">T&uacute; enviaste</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${montoEnviado} ${monedaEnviada}</td>
                          </tr>
                          <tr>
                            <td style="padding:12px 0;color:#64748B;">Recibiste</td>
                            <td style="padding:12px 0;font-weight:800;text-align:right;color:#16A34A;font-size:20px;">${montoRecibido} ${monedaRecibida}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-top:1px solid #F1F5F9;">Fecha</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-top:1px solid #F1F5F9;">${fechaEmision}</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ===================== BOTONES ===================== -->
            <tr>
              <td style="padding:28px 28px 0 28px;background:#FFFFFF;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="width:50%;padding-right:10px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="border-radius:16px;background:linear-gradient(90deg,#123B82,#1D4ED8);text-align:center;height:60px;">
                            <a href="${panelUrl}" style="display:block;line-height:60px;padding:0 20px;color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:0.2px;border-radius:16px;">
                              Ir a mi panel
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="width:50%;padding-left:10px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="border-radius:16px;background:#FFFFFF;border:2px solid #1D4ED8;text-align:center;height:60px;">
                            <a href="${frontUrl}" style="display:block;line-height:60px;padding:0 20px;color:#1D4ED8;text-decoration:none;font-family:Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:0.2px;border-radius:16px;">
                              Ver historial
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ===================== TIP ===================== -->
            <tr>
              <td style="padding:20px 28px 0 28px;background:#FFFFFF;">
                <div style="font-family:Arial,sans-serif;font-size:13px;color:#64748B;line-height:1.6;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;padding:16px 18px;">
                  💡 Puedes revisar el detalle de todas tus operaciones en la secci&oacute;n
                  <span style="color:#0F172A;font-weight:600;">Historial de operaciones</span> de tu panel.
                </div>
              </td>
            </tr>

            <!-- ===================== FOOTER ===================== -->
            <tr>
              <td style="padding:28px 28px 32px 28px;background:#FFFFFF;">
                <div style="border-top:1px solid #E2E8F0;padding-top:20px;font-family:Arial,sans-serif;">
                  <div style="font-size:14px;color:#0F172A;font-weight:700;margin-bottom:8px;">&iquest;Necesitas ayuda?</div>
                  <div style="font-size:14px;color:#64748B;line-height:1.8;">
                    Escr&iacute;benos a <a href="mailto:${soporteEmail}" style="color:#1D4ED8;text-decoration:underline;font-weight:600;">${soporteEmail}</a>
                    o cont&aacute;ctanos al <a href="tel:${soportePhone}" style="color:#1D4ED8;text-decoration:underline;font-weight:600;">${soportePhone}</a>.
                  </div>
                  <div style="margin-top:14px;font-size:12px;color:#94A3B8;">
                    &copy; ${new Date().getFullYear()} Dollariza &mdash; Todos los derechos reservados.
                  </div>
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`;

export const operacionConstanciaTemplate = ({
  nombre,
  codigoOperacion,
  fechaEmision,
  montoEnviado,
  monedaEnviada,
  montoRecibido,
  monedaRecibida,
  tipoOperacion,
  tasa,
  soporteEmail = "info.dollariza@gmail.com",
  soportePhone = "956-767-180",
  minutos = 20,
  loginUrl,
  frontUrl = "https://dollariza.pe",
}) => `
  <div style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F8FAFC;padding:32px 0;">
      <tr>
        <td align="center" style="padding:0 16px;">
          <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(15,23,42,0.08);">

            <!-- ===================== HEADER ===================== -->
            <tr>
              <td style="background:linear-gradient(90deg,#0B1220 0%,#102A56 35%,#123B82 100%);padding:16px 24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <table role="presentation" cellspacing="0" cellpadding="0" style="width:100%;">
                        <tr>
                          <td style="vertical-align:middle;padding-right:14px;white-space:nowrap;">
                            <table role="presentation" cellspacing="0" cellpadding="0" style="background:#FFFFFF;border-radius:14px;padding:8px;box-shadow:0 8px 20px rgba(0,0,0,0.08);">
                              <tr>
                                <td style="text-align:center;">
                                  <img src="${frontUrl}/icons/logomejorado.png" alt="Dollariza" style="width:44px;height:44px;display:block;border-radius:8px;" />
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td style="vertical-align:middle;width:100%;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                              <tr>
                                <td style="font-size:24px;font-weight:800;color:#FFFFFF;font-family:Arial,sans-serif;letter-spacing:0.2px;line-height:1.2;">Dollariza</td>
                              </tr>
                              <tr>
                                <td style="font-size:11px;font-weight:500;color:rgba(255,255,255,0.85);font-family:Arial,sans-serif;padding-top:1px;">Plataforma segura de cambio online</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- ===================== INFO BANNER ===================== -->
            <tr>
              <td style="padding:32px 28px 0 28px;background:#FFFFFF;">
                <div style="background:linear-gradient(135deg,#0C1F3F 0%,#0F3D91 50%,#1A4CB5 100%);border-radius:24px;padding:32px 24px;text-align:center;box-shadow:0 20px 40px rgba(15,61,145,0.12);">
                  <div style="width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,0.15);margin:0 auto 16px auto;font-size:32px;font-weight:bold;color:#ffffff;line-height:64px;text-align:center;">
                    &#9998;
                  </div>
                  <div style="font-family:Arial,sans-serif;color:#FFFFFF;">
                    <div style="font-size:32px;font-weight:800;letter-spacing:-0.3px;line-height:1.15;margin-bottom:8px;">
                      Constancia de operaci&oacute;n
                    </div>
                    <div style="width:50px;height:3px;background:rgba(255,255,255,0.2);border-radius:2px;margin:0 auto 14px auto;"></div>
                    <div style="font-size:15px;font-weight:400;line-height:1.6;color:rgba(255,255,255,0.85);">
                      ${nombre ? `<span style="color:#93C5FD;font-weight:700;">${nombre}</span> &middot; ` : ""}${fechaEmision} &nbsp;|&nbsp; C&oacute;digo: <span style="font-weight:700;">${codigoOperacion}</span>
                    </div>
                  </div>
                </div>
              </td>
            </tr>

            <!-- ===================== DETAIL CARD ===================== -->
            <tr>
              <td style="padding:28px 28px 0 28px;background:#FFFFFF;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                  <tr>
                    <td style="padding:28px;border:1px solid #E2E8F0;border-radius:20px;background:#FFFFFF;box-shadow:0 10px 25px rgba(15,23,42,0.06);">
                      <div style="font-family:Arial,sans-serif;color:#0F172A;">
                        
                        <!-- Header with icon -->
                        <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:24px;">
                          <tr>
                            <td style="vertical-align:middle;padding-right:14px;">
                              <div style="width:44px;height:44px;border-radius:12px;background:#DBEAFE;font-size:24px;font-weight:bold;color:#1D4ED8;line-height:44px;text-align:center;">
                                &#10003;
                              </div>
                            </td>
                            <td style="vertical-align:middle;">
                              <div style="font-size:30px;font-weight:700;color:#0F172A;letter-spacing:-0.3px;">Detalle de la operaci&oacute;n</div>
                            </td>
                          </tr>
                        </table>

                        <!-- Data rows -->
                        <table style="width:100%;font-size:15px;color:#0F172A;line-height:1.9;border-collapse:collapse;">
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;width:45%;">Cliente</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${nombre || ""}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Tipo</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${tipoOperacion}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Tasa de cambio</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${tasa}</td>
                          </tr>
                          <tr>
                            <td style="padding:10px 0;color:#64748B;border-bottom:1px solid #F1F5F9;">Env&iacute;as</td>
                            <td style="padding:10px 0;font-weight:700;text-align:right;border-bottom:1px solid #F1F5F9;">${montoEnviado} ${monedaEnviada}</td>
                          </tr>
                          <tr>
                            <td style="padding:12px 0;color:#64748B;">Recibes</td>
                            <td style="padding:12px 0;font-weight:800;text-align:right;color:#1D4ED8;font-size:20px;">${montoRecibido} ${monedaRecibida}</td>
                          </tr>
                        </table>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ===================== INSTRUCTIONS ===================== -->
            <tr>
              <td style="padding:20px 28px 0 28px;background:#FFFFFF;">
                <div style="font-family:Arial,sans-serif;font-size:13px;color:#64748B;line-height:1.7;background:#FFFBEB;border:1px solid #FDE68A;border-radius:14px;padding:18px;">
                  <div style="font-weight:700;color:#0F172A;margin-bottom:6px;font-size:14px;">📋 Instrucciones de env&iacute;o</div>
                  Env&iacute;a esta constancia al correo <b style="color:#0F172A;">${soporteEmail}</b> dentro de los pr&oacute;ximos <b style="color:#0F172A;">${minutos} minutos</b>
                  junto con el comprobante de tu transferencia. Incluye todos los detalles de la operaci&oacute;n para una verificaci&oacute;n r&aacute;pida y eficiente.
                  <br/><br/>
                  Esta constancia es v&aacute;lida &uacute;nicamente si se valida de manera correcta el comprobante enviado por correo electr&oacute;nico.
                  De lo contrario, quedar&aacute; anulada y no proceder&aacute; la transacci&oacute;n.
                </div>
              </td>
            </tr>

            <!-- ===================== BOTONES ===================== -->
            <tr>
              <td style="padding:28px 28px 0 28px;background:#FFFFFF;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="width:50%;padding-right:10px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="border-radius:16px;background:linear-gradient(90deg,#123B82,#1D4ED8);text-align:center;height:60px;">
                            <a href="${loginUrl || `${frontUrl}/login`}" style="display:block;line-height:60px;padding:0 20px;color:#FFFFFF;text-decoration:none;font-family:Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:0.2px;border-radius:16px;">
                              Ir a mi panel
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                    <td style="width:50%;padding-left:10px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="border-radius:16px;background:#FFFFFF;border:2px solid #1D4ED8;text-align:center;height:60px;">
                            <a href="${frontUrl}" style="display:block;line-height:60px;padding:0 20px;color:#1D4ED8;text-decoration:none;font-family:Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:0.2px;border-radius:16px;">
                              Ver historial
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ===================== FOOTER ===================== -->
            <tr>
              <td style="padding:28px 28px 32px 28px;background:#FFFFFF;">
                <div style="border-top:1px solid #E2E8F0;padding-top:20px;font-family:Arial,sans-serif;">
                  <div style="font-size:14px;color:#0F172A;font-weight:700;margin-bottom:8px;">&iquest;Necesitas ayuda?</div>
                  <div style="font-size:14px;color:#64748B;line-height:1.8;">
                    Escr&iacute;benos a <a href="mailto:${soporteEmail}" style="color:#1D4ED8;text-decoration:underline;font-weight:600;">${soporteEmail}</a>
                    o cont&aacute;ctanos al <a href="tel:${soportePhone}" style="color:#1D4ED8;text-decoration:underline;font-weight:600;">${soportePhone}</a>.
                  </div>
                  <div style="margin-top:14px;font-size:12px;color:#94A3B8;">
                    &copy; ${new Date().getFullYear()} Dollariza &mdash; Todos los derechos reservados.
                  </div>
                </div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </div>
`;

// core/mail/mail.templates.js
export const complaintTemplate = ({
  razonSocial = process.env.RAZON_SOCIAL,
  ruc = process.env.RUC,
  domicilio = process.env.ADDRESS_RUC,
  fecha = "",
  tipo = "",
  email = "",
  alternateEmail = "",
  nombres = "",
  apellidos = "",
  documentType = "",
  documentNumber = "",
  phone = "",
  additionalPhone = "",
  address = "",
  district = "",
  province = "",
  department = "",
  service = "",
  operationNumber = "",
  amountSent = "",
  amountReceived = "",
  detail = "",
  request = "",
}) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:720px;margin:0 auto;">
    <h2 style="margin:0 0 6px;color:#02254A;">Libro de Reclamaciones — ${tipo}</h2>
    <p style="margin:0 0 10px;color:#475569;">
      <b>Fecha:</b> ${fecha}
    </p>

    <div style="border:1px solid #e2e8f0;border-radius:14px;padding:14px;background:#f8fafc;">
      <p style="margin:0;"><b>Razón Social:</b> ${razonSocial}</p>
      <p style="margin:0;"><b>RUC:</b> ${ruc}</p>
      <p style="margin:0;"><b>Domicilio Legal:</b> ${domicilio}</p>
    </div>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />

    <h3 style="margin:0 0 8px;color:#02254A;">I. Datos del Cliente</h3>
    <p style="margin:0 0 6px;"><b>Cliente:</b> ${nombres} ${apellidos}</p>
    <p style="margin:0 0 6px;"><b>Correo:</b> ${email}</p>
    <p style="margin:0 0 6px;"><b>Correo alternativo:</b> ${alternateEmail || "—"}</p>
    <p style="margin:0 0 6px;"><b>Documento:</b> ${documentType} - ${documentNumber}</p>
    <p style="margin:0 0 6px;"><b>Teléfono:</b> ${phone}</p>
    <p style="margin:0 0 6px;"><b>Teléfono adicional:</b> ${additionalPhone || "—"}</p>
    <p style="margin:0 0 6px;"><b>Dirección:</b> ${address}, ${district}, ${province}, ${department}</p>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />

    <h3 style="margin:0 0 8px;color:#02254A;">II. Información del Servicio</h3>
    <p style="margin:0 0 6px;"><b>Servicio:</b> ${service}</p>
    <p style="margin:0 0 6px;"><b>N° Operación:</b> ${operationNumber}</p>
    <p style="margin:0 0 6px;"><b>Envía:</b> ${amountSent}</p>
    <p style="margin:0 0 6px;"><b>Recibe:</b> ${amountReceived}</p>

    <hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0;" />

    <h3 style="margin:0 0 8px;color:#02254A;">III. Descripción</h3>
    <p style="margin:0 0 6px;color:#475569;"><b>Detalle:</b></p>
    <div style="white-space:pre-wrap;border:1px solid #e2e8f0;border-radius:12px;padding:12px;background:#ffffff;">
      ${detail}
    </div>

    <p style="margin:14px 0 6px;color:#475569;"><b>Solicitud del cliente:</b></p>
    <div style="white-space:pre-wrap;border:1px solid #e2e8f0;border-radius:12px;padding:12px;background:#ffffff;">
      ${request}
    </div>

    <p style="margin:16px 0 0;color:#64748b;font-size:12px;">
      Enviado automáticamente desde el Libro de Reclamaciones.
    </p>
  </div>
`;

export const contactUsTemplate = ({
  fecha = '',
  name = '',
  email = '',
  subjectText = '',
  message = '',
}) => `
  <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a;max-width:720px;margin:0 auto;">
    <h2 style="margin:0 0 6px;color:#02254A;">Nuevo mensaje - Contáctanos</h2>
    <p style="margin:0 0 12px;color:#475569;"><b>Fecha:</b> ${fecha}</p>

    <div style="border:1px solid #e2e8f0;border-radius:14px;padding:14px;background:#f8fafc;">
      <p style="margin:0 0 6px;"><b>Nombre:</b> ${name}</p>
      <p style="margin:0 0 6px;"><b>Correo:</b> ${email}</p>
      <p style="margin:0;"><b>Asunto:</b> ${subjectText}</p>
    </div>

    <p style="margin:16px 0 8px;color:#475569;"><b>Mensaje:</b></p>
    <div style="white-space:pre-wrap;border:1px solid #e2e8f0;border-radius:12px;padding:12px;background:#ffffff;">
      ${message}
    </div>

    <p style="margin:16px 0 0;color:#64748b;font-size:12px;">
      Enviado automáticamente desde el formulario “Contáctanos”.
    </p>
  </div>
`;