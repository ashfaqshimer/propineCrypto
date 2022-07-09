const axios = require('axios');

exports.getConversionRate = async (token, currency) => {
	try {
		const response = await axios.get(process.env.CRYPTO_URL, {
			params: { fsyms: token, tsyms: currency },
		});
		return response.data;
	} catch (error) {
		throw new Error('Error getting exchange rates.');
	}
};
