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

exports.validateInput = (token, date) => {
	console.log(typeof token);
	if (token && typeof token !== 'number') {
		throw new Error('Token must be a number');
	}
	if (date && typeof date !== 'string') {
		throw new Error('Date must be a string');
	}

	if (date && !isValidDate(date)) {
		throw new Error('Date must be a string in the form MM/DD/YYYY');
	}
	return true;
};

// Validates that the input string is a valid date formatted as "mm/dd/yyyy"
function isValidDate(dateString) {
	// First check for the pattern
	if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false;

	// Parse the date parts to integers
	const parts = dateString.split('/');
	const day = parseInt(parts[1], 10);
	const month = parseInt(parts[0], 10);
	const year = parseInt(parts[2], 10);

	// Check the ranges of month and year
	if (year < 1000 || year > 3000 || month == 0 || month > 12) return false;

	const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

	// Adjust for leap years
	if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
		monthLength[1] = 29;

	// Check the range of the day
	return day > 0 && day <= monthLength[month - 1];
}
