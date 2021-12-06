import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import type { Update } from 'telegram-typings';
import { addMeeting } from '../api/gql/addMeeting';
import type { Interval, Meeting } from '../api/types';
import type { BindSession } from '../session/BindSession';
import type { CreateSession } from './CreateSession';

dayjs.extend(utc);
dayjs.extend(timezone);

export const confirmCreate = async (
	update: BindSession<Update, CreateSession>
): Promise<Meeting> => {
	const session = await update.getSession();
	const { name, startDate, endDate, startHour, endHour, TZ } = session;
	if (
		name === undefined ||
		startDate === undefined ||
		endDate === undefined ||
		startHour === undefined ||
		endHour === undefined ||
		TZ === undefined
	) {
		throw new Error("I'm missing some data\\.");
	}

	const utcOffset = typeof TZ === 'number' ? TZ : dayjs().tz(TZ).utcOffset() / 60;

	const selectedDates = getDaysBetween(dayjs.utc(startDate), dayjs.utc(endDate).add(1, 'day'));
	const fromHour = dayjs.utc().startOf('day').add(startHour, 'hour').subtract(utcOffset, 'hour');
	let toHour = dayjs.utc().startOf('day').add(endHour, 'hour').subtract(utcOffset, 'hour');
	if (!fromHour.isBefore(toHour)) {
		toHour = toHour.add(1, 'day');
	}
	const intervals = selectedDates.map((date) => getInterval(date, fromHour, toHour));

	return await addMeeting({ name, intervals: foldIntervals(intervals) });
};

const getDaysBetween = (start: Dayjs, end: Dayjs): Dayjs[] => {
	const days: Dayjs[] = [];
	for (let day = start; !day.isSame(end, 'day'); day = day.add(1, 'day')) {
		days.push(day);
	}
	return days;
};

const MIDNIGHT_TODAY = dayjs.utc().startOf('day');

const getInterval = (date: Dayjs, from: Dayjs, to: Dayjs): Interval => {
	const fromDayOffset = from.startOf('day').diff(MIDNIGHT_TODAY, 'day');
	const toDayOffset = to.startOf('day').diff(MIDNIGHT_TODAY, 'day');
	const fromTimestamp = date.hour(from.hour()).add(fromDayOffset, 'day');
	const toTimestamp = date.hour(to.hour()).add(toDayOffset, 'day');
	return {
		beg: fromTimestamp,
		end: toTimestamp,
	};
};

const foldIntervals = (intervals: Interval[]): Interval[] => {
	if (intervals.length <= 1) {
		return intervals;
	}
	intervals.sort((a, b) => a.beg.diff(b.beg));
	const result: Interval[] = [];
	let previous = intervals[0];
	intervals.slice(1).forEach((current) => {
		if (previous.end.isSame(current.beg)) {
			previous = {
				beg: previous.beg,
				end: current.end,
			};
		} else {
			result.push(previous);
			previous = current;
		}
	});
	result.push(previous);
	return result;
};
