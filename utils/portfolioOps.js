const csv = require('csv-parser');
const fs = require('fs');
const { TRANSACTIONS_PATH } = require('../constants');
const { getConversionRate } = require('../services/cryptoCompare');
const { convertTimestampToDate } = require('./dateConversion');

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
			console.log('Displaying latest result.');
			console.log(results);
		});
};

exports.getPortfolioByDate = (date) => {
	const splitDate = date.split('/').map((value) => parseInt(value));

	console.log('Getting portfolio for date ', date);
	const results = [];

	console.log('Reading CSV..');
	const readStream = fs
		.createReadStream(TRANSACTIONS_PATH)
		.pipe(csv())
		.on('data', (data) => {
			const transactionDate = convertTimestampToDate(data.timestamp);

			if (transactionDate.year < splitDate[2]) {
				readStream.destroy();
			}

			if (transactionDate.year === splitDate[2]) {
				if (transactionDate.month < splitDate[0]) {
					readStream.destroy();
				}
				if (transactionDate.month === splitDate[0]) {
					if (transactionDate.date < splitDate[1]) {
						readStream.destroy();
					}
					if (transactionDate.date === splitDate[1]) {
						results.push(data);
					}
				}
			}
		})
		.on('close', async () => {
			if (results.length) {
				const portfolio = await calculatePortfolio(results);
				console.log(portfolio);
			} else {
				console.log('No results found');
			}
		});
};

exports.getPortfolioByToken = (token) => {
	console.log('Getting latest portfolio for ', token);
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
			console.log('Displaying latest result.');
			console.log(results);
		});
};

exports.getPortfolioByTokenAndDate = (token, date) => {
	console.log(`Getting portfolio on date ${date} for token ${token}`);
	const splitDate = date.split('/').map((value) => parseInt(value));
	const results = [];

	const readStream = fs
		.createReadStream(TRANSACTIONS_PATH)
		.pipe(csv())
		.on('data', (data) => {
			const transactionDate = convertTimestampToDate(data.timestamp);

			if (transactionDate.year < splitDate[2]) {
				readStream.destroy();
			}

			if (transactionDate.year === splitDate[2]) {
				if (transactionDate.month < splitDate[0]) {
					readStream.destroy();
				}
				if (transactionDate.month === splitDate[0]) {
					if (transactionDate.date < splitDate[1]) {
						readStream.destroy();
					}
					if (transactionDate.date === splitDate[1]) {
						if (data.token === token) {
							results.push(data);
						}
					}
				}
			}
		})
		.on('close', async () => {
			if (results.length) {
				const portfolio = await calculatePortfolio(results);
				console.log(portfolio);
			} else {
				console.log('No results found');
			}
		});
};

const calculatePortfolio = async (transactions) => {
	const transactionsObject = transactions.reduce((accumulator, transaction) => {
		const { token, transaction_type } = transaction;
		const amount = parseFloat(transaction.amount);
		if (!accumulator[token]) {
			accumulator[token] = 0;
		}

		if (transaction_type === 'DEPOSIT') {
			accumulator[token] = accumulator[token] + amount;
		}
		if (transaction_type === 'WITHDRAWAL') {
			accumulator[token] = accumulator[token] - amount;
		}

		return accumulator;
	}, {});

	const tokens = Object.keys(transactionsObject).join(',');

	const exchangeRate = await getConversionRate(tokens, 'USD');

	for (const token in transactionsObject) {
		transactionsObject[token] =
			transactionsObject[token] * exchangeRate[token].USD;
	}
	return transactionsObject;
};
