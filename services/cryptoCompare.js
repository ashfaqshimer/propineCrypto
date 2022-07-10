const axios = require('axios');

exports.getConversionRate = async (token, currency) => {
	try {
		const response = await axios.get(
			'https://min-api.cryptocompare.com/data/pricemulti',
			{
				headers: {
					Authorization: `Apikey ${process.env.CRYPTO_API_KEY}`,
				},
				params: { fsyms: token, tsyms: currency },
			}
		);
		return response.data;
	} catch (error) {
		let err = 'Error fetching exchange rate data.';
		if (error.response) {
			err = error.response.data;
		}
		throw new Error(err);
	}
};
