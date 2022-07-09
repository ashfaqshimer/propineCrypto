const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const {
	getLatestPortfolio,
	getPortfolioByToken,
	getPortfolioByDate,
	getPortfolioByTokenAndDate,
} = require('./utils/portfolioOps');
const { validateInput } = require('./utils/validations');

require('dotenv').config();

const argv = yargs(hideBin(process.argv)).argv;

const { token, date } = argv;

try {
	validateInput(token, date);

	if (token && date) {
		getPortfolioByTokenAndDate(token, date);
	} else if (token) {
		getPortfolioByToken(token);
	} else if (date) {
		getPortfolioByDate(date);
	} else {
		getLatestPortfolio();
	}
} catch (error) {
	console.log(error.message);
}
