import { cuentasBancariasService } from '../services/cuentas-bancarias.service.js';
import { createCuentaBancariaDto } from '../dtos/create-cuenta-bancaria.dto.js';
import { updateCuentaBancariaDto } from '../dtos/update-cuenta-bancaria.dto.js';
import { ApiResponse } from '../../../core/utils/api-response.js';
import { verifyJWT } from '../../../middleware/auth/verifiy-jwt.js';

export const cuentasBancariasController = {
    // Crear cuenta bancaria
    async create(req, res) {
        try {
            const { error, value } = createCuentaBancariaDto.validate(req.body);
            if (error) {
                return ApiResponse.error(res, error.details[0].message, 400);
            }

            const cuenta = await cuentasBancariasService.createCuentaBancaria(value);
            ApiResponse.success(res, 'Cuenta bancaria creada exitosamente', cuenta, 201);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Obtener por ID
    async getById(req, res) {
        try {
            const { id } = req.params;
            const cuenta = await cuentasBancariasService.getCuentaBancariaById(id);
            ApiResponse.success(res, 'Cuenta bancaria obtenida', cuenta);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Listar todas
    async list(req, res) {
        try {
            const cuentas = await cuentasBancariasService.getAllCuentasBancarias();
            ApiResponse.success(res, 'Cuentas bancarias obtenidas', cuentas);
        } catch (err) {
            ApiResponse.error(res, err.message, 500);
        }
    },

    // Actualizar
    async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = updateCuentaBancariaDto.validate(req.body);
            if (error) {
                return ApiResponse.error(res, error.details[0].message, 400);
            }

            const cuenta = await cuentasBancariasService.updateCuentaBancaria(id, value);
            ApiResponse.success(res, 'Cuenta bancaria actualizada', cuenta);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Eliminar
    async delete(req, res) {
        try {
            const { id } = req.params;
            await cuentasBancariasService.deleteCuentaBancaria(id);
            ApiResponse.success(res, 'Cuenta bancaria eliminada');
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    },

    // Obtener cuentas por código de persona
    async getByCodigoPersona(req, res) {
        try {
            const { codigoPersona } = req.params;
            const cuentas = await cuentasBancariasService.getCuentasByCodigoPersona(codigoPersona);
            ApiResponse.success(res, 'Cuentas bancarias obtenidas', cuentas);
        } catch (err) {
            ApiResponse.error(res, err.message, err.status || 500);
        }
    }
};