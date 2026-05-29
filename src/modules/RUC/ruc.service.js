import axios from 'axios';

export const getRucData = async (ruc) => {
	const token = process.env.APISPERU_TOKEN;

	const url = `https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${token}`;

	const response = await axios.get(url);

	return response.data;
};
