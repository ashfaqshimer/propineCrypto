exports.getLatestPortfolio = () => console.log('Return latest portfolio');

exports.getPortfolioByDate = (date) => {
	console.log('Getting portfolio for date ', date);
};

exports.getPortfolioByToken = (token) => {
	console.log('Getting latest portfolio for ', token);
};

exports.getPortfolioByTokenAndDate = (token, date) => {
	console.log(`Getting portfolio on date ${date} for token ${token}`);
};
