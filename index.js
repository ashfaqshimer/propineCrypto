const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const {
	getLatestPortfolio,
	getPortfolioByToken,
	getPortfolioByDate,
	getPortfolioByTokenAndDate,
} = require('./utils');
const argv = yargs(hideBin(process.argv)).argv;

console.log(argv);

if (argv.token && argv.date) {
	getPortfolioByTokenAndDate(argv.token, argv.date);
} else if (argv.token) {
	getPortfolioByToken(argv.token);
} else if (argv.date) {
	getPortfolioByDate(argv.date);
} else {
	getLatestPortfolio();
}
