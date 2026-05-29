
import { getDniData } from './dni.service.js';

export const fetchDni = async (req, res) => {
	try {
		const { dni } = req.params;

		if (!/^\d{8}$/.test(dni)) {
			return res.status(400).json({ message: 'DNI inválido' });
		}

		const data = await getDniData(dni);

		return res.json({
			nombres: data.nombres,
			apellidos: `${data.apellidoPaterno} ${data.apellidoMaterno}`,
		});

	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Error consultando DNI' });
	}
};