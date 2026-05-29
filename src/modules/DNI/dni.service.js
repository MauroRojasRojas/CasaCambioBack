import axios from 'axios';

export const getDniData = async (dni) => {
	const token = process.env.APISPERU_TOKEN;

	const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`;

	const response = await axios.get(url);

	return response.data;
};