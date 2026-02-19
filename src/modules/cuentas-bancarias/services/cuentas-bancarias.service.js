import { cuentasBancariasRepository } from '../repository/cuentas-bancarias.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const cuentasBancariasService = {
    // Crear cuenta bancaria
    async createCuentaBancaria(cuentaData) {
        const cuentaId = await cuentasBancariasRepository.create(cuentaData);
        return { id: cuentaId, ...cuentaData };
    },

    // Obtener por ID
    async getCuentaBancariaById(id) {
        const cuenta = await cuentasBancariasRepository.findById(id);
        if (!cuenta) {
            throw new AppError('Cuenta bancaria no encontrada', 404, 'CUENTA_BANCARIA_NOT_FOUND');
        }
        return cuenta;
    },

    // Listar todas
    async getAllCuentasBancarias() {
        return await cuentasBancariasRepository.findAll();
    },

    // Actualizar
    async updateCuentaBancaria(id, updateData) {
        const cuenta = await cuentasBancariasRepository.findById(id);
        if (!cuenta) {
            throw new AppError('Cuenta bancaria no encontrada', 404, 'CUENTA_BANCARIA_NOT_FOUND');
        }

        await cuentasBancariasRepository.update(id, updateData);
        return await this.getCuentaBancariaById(id);
    },

    // Eliminar
    async deleteCuentaBancaria(id) {
        const cuenta = await cuentasBancariasRepository.findById(id);
        if (!cuenta) {
            throw new AppError('Cuenta bancaria no encontrada', 404, 'CUENTA_BANCARIA_NOT_FOUND');
        }

        await cuentasBancariasRepository.delete(id);
    },

    // Obtener cuentas por código de persona
    async getCuentasByCodigoPersona(codigoPersona) {
        return await cuentasBancariasRepository.findByCodigoPersona(codigoPersona);
    }
};