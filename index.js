const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

console.log(argv);

if (argv.token) {
	if (typeof argv.token === 'number') {
		console.log('Return token value for input', argv.token);
	} else {
		console.log('Please enter a number for the token value');
	}
} else {
	console.log('Return latest csv value');
}
