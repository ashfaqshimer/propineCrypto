exports.convertDateToTimestamp = (date) => {
	const splitDate = date.split('/');
	const convertedDate = new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
	return convertedDate.getTime();
};

exports.convertTimestampToDate = (timestamp) => {
	const date = new Date(timestamp * 1000);
	return {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		date: date.getDate(),
	};
};
