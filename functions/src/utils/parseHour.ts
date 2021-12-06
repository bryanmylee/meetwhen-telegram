export const parseHour = (str: string): number | undefined => {
	const tokens = str.match(/(\d+).*(am|pm)/);
	if (tokens === null) {
		return undefined;
	}
	const [, hourStr, amPm] = tokens;
	const hour = parseInt(hourStr);
	if (hour > 12) {
		return undefined;
	}
	if (hour === 12) {
		return amPm === 'am' ? 0 : 12;
	}
	return amPm === 'pm' ? hour + 12 : hour;
};
