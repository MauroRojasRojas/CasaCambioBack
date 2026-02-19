import { createRequire } from 'module';
import { tasasCambioRepository } from '../repository/tasas-cambio.repository.js';
import { AppError } from '../../../core/errors/app-error.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar módulo CommonJS usando createRequire
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Importar directamente desde el path del paquete
const CurrencyApi = require(path.resolve(__dirname, '../../../..', 'node_modules/currencyapi-node/src/CurrencyApi.js'));

// Configuración de la API
const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY;

// Márgenes de ganancia diferenciados
const MARGEN_COMPRA = 0.0160; // Margen cuando nosotros COMPRAMOS USD del cliente
const MARGEN_VENTA = 0.0155; // Margen cuando nosotros VENDEMOS USD al cliente

// Validar que existe la API key
if (!CURRENCY_API_KEY) {
    throw new Error('CURRENCY_API_KEY no está definida en las variables de entorno');
}

// Inicializar cliente de la API
const currencyApi = new CurrencyApi(CURRENCY_API_KEY);

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
            // Consultar la API para obtener la tasa USD -> PEN
            const response = await currencyApi.rates().base('USD').get();

            if (!response || !response.rates || !response.rates.PEN) {
                throw new AppError('Error al obtener tasa de cambio de la API', 500, 'API_ERROR');
            }

            const tasaApi = response.rates.PEN; // Valor de 1 USD en PEN (ej: 3.76)

            // ============ OPERACIONES CON USD (compramos/vendemos USD) ============
            // Compramos USD del cliente (cliente VENDE USD) - Tasa más baja
            const tasa_compra_usd = tasaApi - MARGEN_COMPRA;
            
            // Vendemos USD al cliente (cliente COMPRA USD) - Tasa más alta
            const tasa_venta_usd = tasaApi + MARGEN_VENTA;

            // ============ OPERACIONES CON PEN (compramos/vendemos PEN) ============
            // Compramos PEN del cliente (cliente VENDE PEN = COMPRA USD)
            // Tasa más baja en USD por PEN
            const tasa_compra_pen = 1 / tasa_venta_usd;
            
            // Vendemos PEN al cliente (cliente COMPRA PEN = VENDE USD)
            // Tasa más alta en USD por PEN
            const tasa_venta_pen = 1 / tasa_compra_usd;

            // Guardar en base de datos
            const tasaData = {
                fecha_hora: new Date(),
                tasa_api: parseFloat(tasaApi.toFixed(4)),
                margen_compra: MARGEN_COMPRA,
                margen_venta: MARGEN_VENTA,
                tasa_compra_usd: parseFloat(tasa_compra_usd.toFixed(4)),
                tasa_venta_usd: parseFloat(tasa_venta_usd.toFixed(4)),
                tasa_compra_pen: parseFloat(tasa_compra_pen.toFixed(6)),
                tasa_venta_pen: parseFloat(tasa_venta_pen.toFixed(6))
            };

            const id = await tasasCambioRepository.create(tasaData);

            console.log(`✅ Tasa de cambio actualizada: 1 USD = ${tasaApi.toFixed(4)} PEN`);
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
     * Obtiene la tasa de cambio más reciente de la base de datos
     * Devuelve solo los campos públicos (sin tasa_api ni margen)
     */
    async getTasaActual() {
        const tasa = await tasasCambioRepository.findLatest();
        
        if (!tasa) {
            // Si no hay tasas registradas, obtener una nueva
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
    async getTasaById(id) {
        const tasa = await tasasCambioRepository.findById(id);
        
        if (!tasa) {
            throw new AppError('Tasa de cambio no encontrada', 404, 'TASA_NOT_FOUND');
        }

        return formatTasaResponse(tasa);
    }
};
