const csv = require('csv-parser');
const fs = require('fs');
const { TRANSACTIONS_PATH } = require('../constants');

exports.getLatestPortfolio = () => {
	console.log('Return latest portfolio');

	const results = [];

	console.log('Loading CSV..');
	const readStream = fs
		.createReadStream(TRANSACTIONS_PATH)
		.pipe(csv())
		.on('data', (data) => {
			results.push(data);
			readStream.destroy();
		})
		.on('close', () => {
			console.log('Record found');
			console.log(results);
		});
};

exports.getPortfolioByDate = (date) => {
	console.log('Getting portfolio for date ', date);
};

exports.getPortfolioByToken = (token) => {
	console.log('Getting latest portfolio for ', token);
};

exports.getPortfolioByTokenAndDate = (token, date) => {
	console.log(`Getting portfolio on date ${date} for token ${token}`);
};
