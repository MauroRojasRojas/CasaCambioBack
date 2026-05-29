// src/modules/cuentas-internas/services/cuentas-internas.service.js
import { cuentasInternasRepository } from '../repository/cuentas-internas.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

export const cuentasInternasService = {
  async getAll() {
    return await cuentasInternasRepository.findAll();
  },

  async getByMoneda(moneda) {
    if (moneda !== 'PEN' && moneda !== 'USD') {
      throw new AppError('Moneda inválida (debe ser PEN o USD)', 400, 'INVALID_CURRENCY');
    }
    return await cuentasInternasRepository.findByMoneda(moneda);
  },

  async getById(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de cuenta inválido', 400, 'INVALID_ID');
    }
    const cuenta = await cuentasInternasRepository.findById(Number(id));
    if (!cuenta) {
      throw new AppError('Cuenta no encontrada', 404, 'NOT_FOUND');
    }
    return cuenta;
  },

  async create({ banco, tipo_cuenta, numero_cuenta, cci, moneda }) {
    if (!banco || !tipo_cuenta || !numero_cuenta || !moneda) {
      throw new AppError('Faltan campos obligatorios', 400, 'MISSING_FIELDS');
    }
    if (moneda !== 'PEN' && moneda !== 'USD') {
      throw new AppError('Moneda inválida', 400, 'INVALID_CURRENCY');
    }
    
    const existing = await cuentasInternasRepository.findByNumeroCuenta(numero_cuenta);
    if (existing) {
      throw new AppError('El número de cuenta ya está registrado', 409, 'DUPLICATE_ACCOUNT');
    }

    return await cuentasInternasRepository.create({ banco, tipo_cuenta, numero_cuenta, cci, moneda });
  },

  async update(id, data) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de cuenta inválido', 400, 'INVALID_ID');
    }
    const exists = await cuentasInternasRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Cuenta no encontrada', 404, 'NOT_FOUND');
    }

    if (data.numero_cuenta && data.numero_cuenta !== exists.numero_cuenta) {
      const existingDuplicate = await cuentasInternasRepository.findByNumeroCuenta(data.numero_cuenta);
      if (existingDuplicate) {
        throw new AppError('El nuevo número de cuenta ya está en uso', 409, 'DUPLICATE_ACCOUNT');
      }
    }

    const updatedData = {
      banco: data.banco ?? exists.banco,
      tipo_cuenta: data.tipo_cuenta ?? exists.tipo_cuenta,
      numero_cuenta: data.numero_cuenta ?? exists.numero_cuenta,
      cci: data.cci !== undefined ? data.cci : exists.cci,
      moneda: data.moneda ?? exists.moneda,
      activa: data.activa !== undefined ? data.activa : exists.activa
    };

    if (updatedData.moneda !== 'PEN' && updatedData.moneda !== 'USD') {
      throw new AppError('Moneda inválida', 400, 'INVALID_CURRENCY');
    }

    return await cuentasInternasRepository.update(Number(id), updatedData);
  },

  async delete(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de cuenta inválido', 400, 'INVALID_ID');
    }
    const exists = await cuentasInternasRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Cuenta no encontrada', 404, 'NOT_FOUND');
    }
    return await cuentasInternasRepository.delete(Number(id));
  },

  async toggleActiva(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID de cuenta inválido', 400, 'INVALID_ID');
    }
    const exists = await cuentasInternasRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Cuenta no encontrada', 404, 'NOT_FOUND');
    }
    return await cuentasInternasRepository.toggleActiva(Number(id));
  }
};
