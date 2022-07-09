const csv = require('csv-parser');
const fs = require('fs');

const parseCSV = (csvPath) => {
	const results = [];

	console.log('Loading CSV..');
	const readStream = fs
		.createReadStream(csvPath)
		.pipe(csv())
		.on('data', (data) => {
			results.push(data);
			readStream.destroy();
		})
		.on('end', () => {
			console.log('CSV Loaded..');

			console.log(results);
			// return results;
		})
		.on('close', () => {
			console.log('Record found');
			console.log(results);
		});
};

module.exports = parseCSV;
