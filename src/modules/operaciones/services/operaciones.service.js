import { operacionesRepository } from "../repository/operaciones.repository.js";
import { AppError } from "../../../core/errors/app-error.js";
import { sendOperacionConstanciaEmail, sendPagoConfirmadoEmail } from "../../../core/mail/mail.service.js";
import Decimal from "decimal.js";
import ExcelJS from 'exceljs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const money2 = (n) => new Decimal(n ?? 0).toFixed(2);
const tasa6  = (n) => new Decimal(n ?? 0).toFixed(6);

export const operacionesService = {
  // ===========================
  // Crear operación
  // ===========================
  createOperacion: async (data, user) => {
    try {
      const operacionId = await operacionesRepository.create(data);

      // Traer la operación creada (para usarla en el correo y devolverla)
      const op = await operacionesRepository.findById(operacionId);

      // correo no bloqueante
      try {
        await sendOperacionConstanciaEmail({
          to: user?.correo,
          codigoOperacion: op.codigoOperacion,
          fechaEmision: new Date(op.fechaEmision).toLocaleString("es-PE"),
          montoEnviado: money2(op.montoEnviado),
          monedaEnviada: op.monedaEnviada,
          montoRecibido: money2(op.montoRecibido),
          monedaRecibida: op.monedaRecibida,
          tipoOperacion: op.tipoOperacion,
          tasa: tasa6(
            op.tipoOperacion === "COMPRA" ? op.tasaCompra : op.tasaVenta,
          ),
          nombre: user?.nombres || "",
          // y en el template ya dices que para PDF vaya a Historial
        });
      } catch (e) {
        console.log("⚠️ correo constancia falló:", e.message);
      }

      return op;
    } catch (error) {
      throw new AppError(
        "Error al crear la operación",
        500,
        "CREATE_OPERACION_ERROR",
      );
    }
  },

  // ===========================
  // Obtener todas las operaciones
  // ===========================
  getAllOperaciones: async () => {
    try {
      return await operacionesRepository.findAll();
    } catch (error) {
      throw new AppError(
        "Error al obtener las operaciones",
        500,
        "GET_OPERACIONES_ERROR",
      );
    }
  },

  // ===========================
  // Obtener todas las operaciones (admin)
  // ===========================
  getAllOperacionesAdmin: async ({ desde, hasta, estados }) => {
    try {
      return await operacionesRepository.findAllAdmin({ desde, hasta, estados });
    } catch (error) {
      throw new AppError('Error al obtener operaciones (admin)', 500, 'GET_OPERACIONES_ADMIN_ERROR');
    }
  },

  // ===========================
  // Obtener estadísticas
  // ===========================
  getEstadisticas: async ({ desde, hasta, agrupacion }) => {
    try {
      return await operacionesRepository.getEstadisticas({ desde, hasta, agrupacion });
    } catch (error) {
      throw new AppError('Error al obtener estadísticas', 500, 'GET_ESTADISTICAS_ERROR');
    }
  },

  // ===========================
  // Actualizar solo el estado
  // ===========================
  updateOperacionEstado: async (codigoOperacion, estado) => {
    try {
      // Si el nuevo estado es TRANSFERIDO, obtenemos los datos para el correo
      let operacionData = null;
      if (estado === 'TRANSFERIDO') {
        operacionData = await operacionesRepository.findByCodigoOperacion(codigoOperacion);
      }

      const updated = await operacionesRepository.updateEstado(codigoOperacion, estado);
      if (!updated) {
        throw new AppError('Operación no encontrada', 404, 'OPERACION_NOT_FOUND');
      }

      // Enviar correo de confirmación si se marcó como TRANSFERIDO
      if (estado === 'TRANSFERIDO' && operacionData?.correoCliente) {
        try {
          await sendPagoConfirmadoEmail({
            to: operacionData.correoCliente,
            nombre: operacionData.nombreCliente || '',
            codigoOperacion: operacionData.codigoOperacion,
            fechaEmision: new Date(operacionData.fechaEmision).toLocaleString('es-PE'),
            montoEnviado: money2(operacionData.montoEnviado),
            monedaEnviada: operacionData.monedaEnviada,
            montoRecibido: money2(operacionData.montoRecibido),
            monedaRecibida: operacionData.monedaRecibida,
            tipoOperacion: operacionData.tipoOperacion,
            tasa: tasa6(
              operacionData.tipoOperacion === 'COMPRA' ? operacionData.tasaCompra : operacionData.tasaVenta,
            ),
          });
        } catch (emailError) {
          console.log('⚠️ Correo de pago confirmado falló:', emailError.message);
        }
      }

      return { message: 'Estado actualizado exitosamente' };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Error al actualizar el estado', 500, 'UPDATE_ESTADO_ERROR');
    }
  },

  // ===========================
  // Obtener operación por ID
  // ===========================
  getOperacionById: async (id) => {
    try {
      const operacion = await operacionesRepository.findById(id);
      if (!operacion) {
        throw new AppError(
          "Operación no encontrada",
          404,
          "OPERACION_NOT_FOUND",
        );
      }
      return operacion;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error al obtener la operación",
        500,
        "GET_OPERACION_ERROR",
      );
    }
  },

  // ===========================
  // Obtener operaciones por código de persona
  // ===========================
  getOperacionesByPersonaCode: async (personaCode) => {
    try {
      return await operacionesRepository.findByPersonaCode(personaCode);
    } catch (error) {
      throw new AppError(
        "Error al obtener las operaciones de la persona",
        500,
        "GET_OPERACIONES_PERSONA_ERROR",
      );
    }
  },

  // ===========================
  // Actualizar operación
  // ===========================
  updateOperacion: async (id, data) => {
    try {
      const updated = await operacionesRepository.update(id, data);
      if (!updated) {
        throw new AppError(
          "Operación no encontrada",
          404,
          "OPERACION_NOT_FOUND",
        );
      }
      return await operacionesRepository.findById(id);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error al actualizar la operación",
        500,
        "UPDATE_OPERACION_ERROR",
      );
    }
  },

  // ===========================
  // Exportar operaciones a Excel
  // ===========================
  exportExcel: async ({ desde, hasta, estados }) => {
    try {
      const operaciones = await operacionesRepository.findAllAdmin({ desde, hasta, estados });
      const wb = new ExcelJS.Workbook();
      wb.creator = process.env.RAZON_SOCIAL || 'M&M DIVISAS';
      wb.created = new Date();

      const ws = wb.addWorksheet('Operaciones');

      ws.columns = [
        { width: 16 }, { width: 24 }, { width: 14 }, { width: 14 }, { width: 28 },
        { width: 20 }, { width: 12 }, { width: 16 }, { width: 12 }, { width: 16 },
        { width: 12 }, { width: 14 }, { width: 14 }, { width: 14 },
      ];

      const logoPath = path.join(__dirname, '../../../../uploads/logomejorado.png');
      let logoId;
      try {
        const fs = await import('fs');
        if (fs.existsSync(logoPath)) {
          const logoBuffer = fs.readFileSync(logoPath);
          logoId = wb.addImage({ buffer: logoBuffer, extension: 'png' });
        }
      } catch {
        // logo not available
      }

      const BLUE = '02254A';
      const RAZON_SOCIAL = process.env.RAZON_SOCIAL || 'M&M DIVISAS';
      const RUC = process.env.RUC || '20614994364';
      const rowH = 30;
      const logoSize = 80;

      if (logoId !== undefined) {
        ws.addImage(logoId, {
          tl: { col: 0, row: 0 },
          ext: { width: logoSize, height: logoSize },
        });
      }

      ws.mergeCells(1, 2, 1, 10);
      const titleCell = ws.getCell('B1');
      titleCell.value = RAZON_SOCIAL;
      titleCell.font = { name: 'Calibri', size: 20, bold: true, color: { argb: BLUE } };
      titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
      ws.getRow(1).height = rowH;

      ws.mergeCells(2, 2, 2, 10);
      const rucCell = ws.getCell('B2');
      rucCell.value = `RUC: ${RUC}`;
      rucCell.font = { name: 'Calibri', size: 11, color: { argb: '666666' } };
      rucCell.alignment = { vertical: 'middle', horizontal: 'left' };

      ws.mergeCells(3, 1, 3, 14);
      const titleR = ws.getCell('A3');
      titleR.value = 'REPORTE DE OPERACIONES';
      titleR.font = { name: 'Calibri', size: 15, bold: true, color: { argb: BLUE } };
      titleR.alignment = { vertical: 'middle', horizontal: 'center' };
      ws.getRow(3).height = rowH;

      ws.mergeCells(4, 1, 4, 14);
      const desdeStr = desde ? new Date(desde).toLocaleDateString('es-PE') : '-';
      const hastaStr = hasta ? new Date(hasta).toLocaleDateString('es-PE') : '-';
      const dateCell = ws.getCell('A4');
      dateCell.value = `Período: ${desdeStr} — ${hastaStr}`;
      dateCell.font = { name: 'Calibri', size: 10, italic: true, color: { argb: '888888' } };
      dateCell.alignment = { vertical: 'middle', horizontal: 'center' };

      ws.getRow(5).height = 10;

      const HR = 6;
      const headers = [
        'Código', 'Cliente', 'Documento', 'Teléfono', 'Correo',
        'Cuenta Destino', 'Tipo', 'Monto Enviado', 'Moneda Env.',
        'Monto Recibido', 'Moneda Rec.', 'Tasa Cambio', 'Fecha', 'Estado',
      ];

      const hRow = ws.getRow(HR);
      headers.forEach((h, i) => {
        const cell = hRow.getCell(i + 1);
        cell.value = h;
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BLUE } };
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: 'BFBFBF' } },
          bottom: { style: 'thin', color: { argb: 'BFBFBF' } },
          left: { style: 'thin', color: { argb: 'BFBFBF' } },
          right: { style: 'thin', color: { argb: 'BFBFBF' } },
        };
      });
      hRow.height = 26;

      const DR = HR + 1;
      const fmt = (val, mon) => `${mon === 'PEN' ? 'S/' : '$'} ${(parseFloat(val) || 0).toFixed(2)}`;

      operaciones.forEach((op, idx) => {
        const r = ws.getRow(DR + idx);
        const vals = [
          op.codigoOperacion, op.cliente, op.documento, op.telefono,
          op.correo, op.numeroCuenta, op.tipoOperacion,
          fmt(op.montoEnviado, op.monedaEnviada), op.monedaEnviada,
          fmt(op.montoRecibido, op.monedaRecibida), op.monedaRecibida,
          (parseFloat(op.tasaCambio) || 0).toFixed(4),
          op.fechaEmision ? new Date(op.fechaEmision).toLocaleDateString('es-PE') : '-',
          op.estado,
        ];

        vals.forEach((v, ci) => {
          const cell = r.getCell(ci + 1);
          cell.value = v;
          cell.font = { name: 'Calibri', size: 10, color: { argb: '333333' } };
          cell.alignment = {
            vertical: 'middle',
            horizontal: ci >= 7 && ci <= 11 ? 'right' : 'left',
          };
          cell.border = {
            top: { style: 'thin', color: { argb: 'E0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'E0E0E0' } },
            left: { style: 'thin', color: { argb: 'E0E0E0' } },
            right: { style: 'thin', color: { argb: 'E0E0E0' } },
          };
          if (idx % 2 === 1) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F8FC' } };
          }
        });
        r.height = 22;
      });

      if (operaciones.length > 0) {
        const SR = DR + operaciones.length + 1;
        ws.getRow(SR).height = 10;

        const sH = SR + 1;
        ws.mergeCells(sH, 1, sH, 14);
        const sCell = ws.getCell(`A${sH}`);
        sCell.value = 'RESUMEN DEL PERÍODO';
        sCell.font = { name: 'Calibri', size: 13, bold: true, color: { argb: BLUE } };
        sCell.alignment = { vertical: 'middle', horizontal: 'left' };
        ws.getRow(sH).height = 26;

        const totalEnviadoUSD = operaciones
          .filter((o) => o.monedaEnviada === 'USD')
          .reduce((s, o) => s + (parseFloat(o.montoEnviado) || 0), 0);
        const totalRecibidoPEN = operaciones
          .filter((o) => o.monedaRecibida === 'PEN')
          .reduce((s, o) => s + (parseFloat(o.montoRecibido) || 0), 0);

        const stats = [
          ['Total Operaciones', operaciones.length.toString()],
          ['Total Compra USD', `$ ${totalEnviadoUSD.toFixed(2)}`],
          ['Total Venta PEN', `S/ ${totalRecibidoPEN.toFixed(2)}`],
          ['Transferidas', operaciones.filter((o) => o.estado === 'TRANSFERIDO').length.toString()],
          ['Pendientes', operaciones.filter((o) => o.estado === 'PENDIENTE').length.toString()],
          ['Rechazadas', operaciones.filter((o) => o.estado === 'RECHAZADO').length.toString()],
        ];

        stats.forEach(([l, v], i) => {
          const rn = sH + 1 + i;
          const lc = ws.getCell(`A${rn}`);
          lc.value = l;
          lc.font = { name: 'Calibri', size: 11, bold: true, color: { argb: '555555' } };
          lc.alignment = { vertical: 'middle', horizontal: 'left' };
          lc.border = { bottom: { style: 'thin', color: { argb: 'E0E0E0' } } };

          ws.mergeCells(rn, 2, rn, 4);
          const vc = ws.getCell(`B${rn}`);
          vc.value = v;
          vc.font = { name: 'Calibri', size: 11, bold: true, color: { argb: BLUE } };
          vc.alignment = { vertical: 'middle', horizontal: 'left' };
          vc.border = { bottom: { style: 'thin', color: { argb: 'E0E0E0' } } };
        });
      }

      const lastR = ws.lastRow?.number || 0;
      const fR = lastR + 2;
      ws.mergeCells(fR, 1, fR, 14);
      const fCell = ws.getCell(`A${fR}`);
      fCell.value = `Reporte generado el ${new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })} — ${RAZON_SOCIAL}`;
      fCell.font = { name: 'Calibri', size: 9, italic: true, color: { argb: 'AAAAAA' } };
      fCell.alignment = { vertical: 'middle', horizontal: 'center' };

      ws.pageSetup.orientation = 'landscape';
      ws.pageSetup.fitToPage = true;
      ws.pageSetup.fitToWidth = 1;
      ws.pageSetup.paperSize = 9;

      const buffer = await wb.xlsx.writeBuffer();
      return buffer;
    } catch (error) {
      throw new AppError('Error al exportar Excel', 500, 'EXPORT_EXCEL_ERROR');
    }
  },

  // ===========================
  // Eliminar operación
  // ===========================
  deleteOperacion: async (id) => {
    try {
      const deleted = await operacionesRepository.delete(id);
      if (!deleted) {
        throw new AppError(
          "Operación no encontrada",
          404,
          "OPERACION_NOT_FOUND",
        );
      }
      return { message: "Operación eliminada exitosamente" };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Error al eliminar la operación",
        500,
        "DELETE_OPERACION_ERROR",
      );
    }
  },
};
