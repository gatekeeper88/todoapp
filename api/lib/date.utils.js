function getEndOfDay(day) {
	return new Date(day.getFullYear()
		,day.getMonth()
		,day.getDate()
		,23,59,59);
}

module.exports.getEndOfDay = getEndOfDay;