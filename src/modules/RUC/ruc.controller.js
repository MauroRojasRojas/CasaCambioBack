import { getRucData } from './ruc.service.js';

export const fetchRuc = async (req, res) => {
	try {
		const { ruc } = req.params;

		// 🔒 Validación
		if (!/^\d{11}$/.test(ruc)) {
			return res.status(400).json({ message: 'RUC inválido' });
		}

		const data = await getRucData(ruc);

		return res.json({
			ruc: data.ruc,
			razonSocial: data.razonSocial,
			direccion: data.direccion,
			estado: data.estado,
			condicion: data.condicion,
			departamento: data.departamento,
			provincia: data.provincia,
			distrito: data.distrito,
		});

	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error consultando RUC' });
	}
};