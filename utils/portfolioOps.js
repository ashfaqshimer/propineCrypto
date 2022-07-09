const csv = require('csv-parser');
const fs = require('fs');
const { TRANSACTIONS_PATH } = require('../constants');
const { getConversionRate } = require('../services/cryptoCompare');
const { convertDateToUnixTimestamp } = require('./dateConversion');

exports.getLatestPortfolio = async () => {
	console.log('Getting latest portfolio values');
	let portfolio = {};

	console.log('Reading CSV..');
	fs.createReadStream(TRANSACTIONS_PATH)
		.pipe(csv())
		.on('data', (data) => {
			portfolio = calculatePortfolio(portfolio, data);
		})
		.on('close', async () => {
			console.log('Finished reading data. Portfolio amounts:');
			console.log(portfolio);
			try {
				portfolio = await calculateCurrencyPortfolio(portfolio, 'USD');
				console.log(portfolio);
			} catch (err) {
				console.log(err.message);
			}
		});
};

exports.getPortfolioByDate = (thresholdDate) => {
	const timestampThreshold = convertDateToUnixTimestamp(thresholdDate);
	let portfolio = {};

	console.log('Reading CSV..');
	fs.createReadStream(TRANSACTIONS_PATH)
		.pipe(csv())
		.on('data', (data) => {
			if (data.timestamp < timestampThreshold) {
				portfolio = calculatePortfolio(portfolio, data);
			}
		})
		.on('close', async () => {
			console.log('Finished reading data. Portfolio amounts:');
			console.log(portfolio);
			try {
				portfolio = await calculateCurrencyPortfolio(portfolio, 'USD');
				console.log(portfolio);
			} catch (err) {
				console.log(err.message);
			}
		});
};

exports.getPortfolioByToken = (token) => {
	console.log(`Getting latest portfolio for ${token}`);
	let portfolio = {};

	console.log('Reading CSV..');
	fs.createReadStream(TRANSACTIONS_PATH)
		.pipe(csv())
		.on('data', (data) => {
			if (data.token === token) {
				portfolio = calculatePortfolio(portfolio, data);
			}
		})
		.on('close', async () => {
			console.log('Finished reading data. Portfolio amounts: ');
			console.log(portfolio);
			try {
				portfolio = await calculateCurrencyPortfolio(portfolio, 'USD');
				console.log(portfolio);
			} catch (err) {
				console.log(err.message);
			}
		});
};

exports.getPortfolioByTokenAndDate = (token, thresholdDate) => {
	console.log(`Getting portfolio as at ${thresholdDate} for token ${token}`);
	const timestampThreshold = convertDateToUnixTimestamp(thresholdDate);
	let portfolio = {};

	console.log('Reading CSV..');
	fs.createReadStream(TRANSACTIONS_PATH)
		.pipe(csv())
		.on('data', (data) => {
			if (data.timestamp < timestampThreshold && data.token === token) {
				portfolio = calculatePortfolio(portfolio, data);
			}
		})
		.on('close', async () => {
			console.log('Finished reading data. Portfolio amounts:');
			console.log(portfolio);
			try {
				portfolio = await calculateCurrencyPortfolio(portfolio, 'USD');
				console.log(portfolio);
			} catch (err) {
				console.log(err.message);
			}
		});
};

const calculatePortfolio = (currentPortfolio, transaction) => {
	const updatedPortfolio = { ...currentPortfolio };

	const { token, transaction_type } = transaction;
	const amount = parseFloat(transaction.amount);
	if (!updatedPortfolio[token]) {
		updatedPortfolio[token] = 0;
	}

	if (transaction_type === 'DEPOSIT') {
		updatedPortfolio[token] = updatedPortfolio[token] + amount;
	}
	if (transaction_type === 'WITHDRAWAL') {
		updatedPortfolio[token] = updatedPortfolio[token] - amount;
	}

	return updatedPortfolio;
};

const calculateCurrencyPortfolio = async (currentPortfolio, currency) => {
	console.log(`Calculating ${currency} value of portfolio..`);
	const updatedPortfolio = { ...currentPortfolio };
	const tokens = Object.keys(updatedPortfolio).join(',');
	const exchangeRate = await getConversionRate(tokens, currency);

	for (const token in updatedPortfolio) {
		updatedPortfolio[token] = updatedPortfolio[token] * exchangeRate[token].USD;
	}
	return updatedPortfolio;
};
