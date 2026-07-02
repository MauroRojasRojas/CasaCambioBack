import { tasasCambioRepository } from '../repository/tasas-cambio.repository.js';
import { AppError } from '../../../core/errors/app-error.js';
import { configTasasRepository } from '../../config-tasas/repository/config-tasas.repository.js';
import { getExchangeRate } from '../../../core/exchange-rate/fastforex.service.js';
import { getRecomendedRate } from '../../../core/exchange-rate/marr-api.service.js';

/**
 * Formatea la respuesta eliminando campos internos (tasa_api, margen_compra, margen_venta)
 * que no deben ser expuestos en los endpoints públicos
 */
const formatTasaResponse = (tasa) => {
    if (!tasa) return null;

    const { tasa_api, margen_compra, margen_venta, ...tasaPublica } = tasa;
    return tasaPublica;
};

/**
 * Formatea un array de tasas eliminando campos internos
 */
const formatTasasResponse = (tasas) => {
    if (!Array.isArray(tasas)) return [];
    return tasas.map(formatTasaResponse);
};

export const tasasCambioService = {
    /**
     * Obtiene la tasa actual de USD a PEN desde la API externa
     * y la guarda en la base de datos con los márgenes calculados
     * Calcula tasas bidireccionales para operaciones PEN ↔ USD
     */
    async fetchAndSaveTasaCambio() {
        try {
            const tasaApi = await getExchangeRate();

            const config = await configTasasRepository.getConfig();

            if (!config) {
                throw new AppError(
                    'No existe configuración de tasas',
                    500,
                    'CONFIG_NOT_FOUND'
                );
            }

            let tasa_compra_usd;
            let tasa_venta_usd;
            let tasaApiFinal = tasaApi;

            if (config.modo === 'MANUAL') {
                tasa_compra_usd =
                    parseFloat(config.tasa_compra_usd_manual);
                tasa_venta_usd =
                    parseFloat(config.tasa_venta_usd_manual);
                tasaApiFinal = (tasa_compra_usd + tasa_venta_usd) / 2;
            } else if (config.modo === 'RECOMENDADO') {
                const recomendado = await getRecomendedRate();
                tasa_compra_usd = recomendado.buy * (1 - parseFloat(config.margen_compra));
                tasa_venta_usd = recomendado.sale * (1 + parseFloat(config.margen_venta));
                tasaApiFinal = recomendado.referenceAvg;
            } else {
                tasa_compra_usd = tasaApi * (1 - parseFloat(config.margen_compra));
                tasa_venta_usd = tasaApi * (1 + parseFloat(config.margen_venta));
            }

            // ============ OPERACIONES CON PEN (compramos/vendemos PEN) ============
            const tasa_compra_pen = 1 / tasa_venta_usd;
            const tasa_venta_pen = 1 / tasa_compra_usd;

            // Guardar en base de datos
            const tasaData = {
                fecha_hora: new Date(),
                tasa_api: parseFloat(tasaApiFinal.toFixed(4)),
                margen_compra: config.margen_compra,
                margen_venta: config.margen_venta,
                tasa_compra_usd: parseFloat(tasa_compra_usd.toFixed(4)),
                tasa_venta_usd: parseFloat(tasa_venta_usd.toFixed(4)),
                tasa_compra_pen: parseFloat(tasa_compra_pen.toFixed(6)),
                tasa_venta_pen: parseFloat(tasa_venta_pen.toFixed(6))
            };

            const id = await tasasCambioRepository.create(tasaData);

            console.log(`✅ Tasa de cambio actualizada: 1 USD = ${tasaApiFinal.toFixed(4)} PEN (modo: ${config.modo})`);
            console.log(`   💵 USD: Compra=${tasa_compra_usd.toFixed(4)} PEN | Venta=${tasa_venta_usd.toFixed(4)} PEN`);
            console.log(`   💰 PEN: Compra=${tasa_compra_pen.toFixed(6)} USD | Venta=${tasa_venta_pen.toFixed(6)} USD`);

            return {
                id,
                ...tasaData
            };

        } catch (error) {
            console.error('❌ Error al obtener y guardar tasa de cambio:', error);
            throw error;
        }
    },

    /**
     * Obtiene las tasas recomendadas directamente de la API MARR
     */
    async getTasaRecomendada() {
        try {
            const recomendado = await getRecomendedRate();
            return recomendado;
        } catch (error) {
            console.error('❌ Error al obtener tasa recomendada:', error.message);
            return null;
        }
    },

    /**
     * Obtiene la tasa de cambio más reciente de la base de datos
     * Devuelve solo los campos públicos (sin tasa_api ni margen)
     */
    async getTasaActual() {
        const tasa = await tasasCambioRepository.findLatest();

        if (!tasa) {
            console.log('No hay tasas registradas, obteniendo de la API...');
            const nuevaTasa = await this.fetchAndSaveTasaCambio();
            return formatTasaResponse(nuevaTasa);
        }

        return formatTasaResponse(tasa);
    },

    /**
     * Obtiene el histórico de tasas de cambio
     * Devuelve solo los campos públicos (sin tasa_api ni margen)
     */
    async getHistorico(limit = 100) {
        const tasas = await tasasCambioRepository.findAll(limit);
        return formatTasasResponse(tasas);
    },

    /**
     * Obtiene tasas por rango de fechas
     * Devuelve solo los campos públicos (sin tasa_api ni margen)
     */
    async getTasasByDateRange(fechaInicio, fechaFin) {
        if (!fechaInicio || !fechaFin) {
            throw new AppError('Se requieren fechaInicio y fechaFin', 400, 'MISSING_DATES');
        }

        const tasas = await tasasCambioRepository.findByDateRange(fechaInicio, fechaFin);
        return formatTasasResponse(tasas);
    },

    /**
     * Obtiene una tasa por ID
     * Devuelve solo los campos públicos (sin tasa_api ni margen)
     */
    async getTasaApiRaw() {
        const tasa = await tasasCambioRepository.findLatest();
        return tasa?.tasa_api ? parseFloat(tasa.tasa_api) : null;
    },

    async getTasaById(id) {
        const tasa = await tasasCambioRepository.findById(id);

        if (!tasa) {
            throw new AppError('Tasa de cambio no encontrada', 404, 'TASA_NOT_FOUND');
        }

        return formatTasaResponse(tasa);
    },

    /**
     * Obtiene tasas históricas desde inicio de año hasta la fecha indicada
     * Consulta la base de datos local (poblada cada 10 min por el cron job)
     * Devuelve sin márgenes (es historial)
     */
    async getTasasDesdeInicioAno(dia, mes, ano) {
        const diaNum = parseInt(dia);
        const mesNum = parseInt(mes);
        const anoNum = parseInt(ano);

        if (isNaN(diaNum) || isNaN(mesNum) || isNaN(anoNum)) {
            throw new AppError('Parámetros inválidos: dia, mes y ano deben ser números', 400, 'INVALID_PARAMS');
        }

        if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 || anoNum < 2000 || anoNum > 2100) {
            throw new AppError('Fecha inválida', 400, 'INVALID_DATE');
        }

        const fechaFin = new Date(anoNum, mesNum - 1, diaNum);

        if (isNaN(fechaFin.getTime())) {
            throw new AppError('Fecha inválida', 400, 'INVALID_DATE');
        }

        const año_actual = fechaFin.getFullYear();
        const fechaInicio = new Date(año_actual, 0, 1);

        const formatoFecha = (fecha) => {
            const y = fecha.getFullYear();
            const m = String(fecha.getMonth() + 1).padStart(2, '0');
            const d = String(fecha.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };

        const fechaInicioStr = formatoFecha(fechaInicio);
        const fechaFinStr = formatoFecha(fechaFin);

        try {
            const rows = await tasasCambioRepository.findDailyByDateRange(fechaInicioStr, fechaFinStr);

            const tasas = rows.map(row => ({
                fecha: row.fecha,
                tasa_usd_pen: parseFloat(row.tasa_api.toFixed(4)),
                tasa_pen_usd: parseFloat((1 / row.tasa_api).toFixed(6))
            }));

            return tasas;

        } catch (error) {
            throw new AppError(`Error al obtener tasas históricas: ${error.message}`, 500, 'HISTORICAL_DB_ERROR');
        }
    }
};
