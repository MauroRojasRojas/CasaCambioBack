import { redesSocialesRepository } from '../repository/redes-sociales.repository.js';
import { AppError } from '../../../core/errors/app-error.js';

const DOMAIN_MAP = {
  'Instagram': /instagram\.com/,
  'TikTok': /tiktok\.com/,
  'Facebook': /facebook\.com/,
  'Twitter': /twitter\.com|x\.com/,
  'YouTube': /youtube\.com/,
  'LinkedIn': /linkedin\.com/,
  'WhatsApp': /wa\.me|api\.whatsapp\.com/,
  'Telegram': /t\.me/
};

const VALID_REDES = Object.keys(DOMAIN_MAP);

function validateUrl(red, url) {
  if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
    throw new AppError('La URL debe comenzar con http:// o https://', 400, 'INVALID_URL');
  }
  const pattern = DOMAIN_MAP[red];
  if (!pattern) {
    throw new AppError(`Red social "${red}" no válida`, 400, 'INVALID_SOCIAL_NETWORK');
  }
  if (!pattern.test(url)) {
    throw new AppError(`La URL no corresponde al dominio de ${red}`, 400, 'URL_DOMAIN_MISMATCH');
  }
}

export const redesSocialesService = {
  async getPublic() {
    return await redesSocialesRepository.findAllPublic();
  },

  async getAll() {
    const redes = await redesSocialesRepository.findAll();
    const configured = redes.map(r => r.red);
    const all = VALID_REDES.map(red => {
      const existing = redes.find(r => r.red === red);
      return existing || { red, url: '', activa: 0, orden: 99, id: null };
    });
    all.sort((a, b) => a.orden - b.orden);
    return all;
  },

  async getById(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const red = await redesSocialesRepository.findById(Number(id));
    if (!red) {
      throw new AppError('Red social no encontrada', 404, 'NOT_FOUND');
    }
    return red;
  },

  async upsert({ red, url, activa, orden }) {
    if (!red || !VALID_REDES.includes(red)) {
      throw new AppError(`Red social no válida. Debe ser una de: ${VALID_REDES.join(', ')}`, 400, 'INVALID_SOCIAL_NETWORK');
    }
    validateUrl(red, url);
    return await redesSocialesRepository.upsert({ red, url, activa: activa ?? 1, orden: orden ?? 0 });
  },

  async toggleActiva(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const exists = await redesSocialesRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Red social no encontrada', 404, 'NOT_FOUND');
    }
    return await redesSocialesRepository.toggleActiva(Number(id));
  },

  async delete(id) {
    if (!id || isNaN(Number(id))) {
      throw new AppError('ID inválido', 400, 'INVALID_ID');
    }
    const exists = await redesSocialesRepository.findById(Number(id));
    if (!exists) {
      throw new AppError('Red social no encontrada', 404, 'NOT_FOUND');
    }
    return await redesSocialesRepository.delete(Number(id));
  }
};
