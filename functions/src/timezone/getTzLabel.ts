export const getTzLabel = (utcOffset: number): string => {
	const absOffset = Math.abs(utcOffset);
	const isNegative = utcOffset < 0;
	return `UTC${isNegative ? '-' : '+'}${absOffset}`;
};
