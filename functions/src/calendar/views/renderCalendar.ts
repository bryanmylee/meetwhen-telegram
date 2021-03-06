import type { Dayjs } from 'dayjs';
import type { InlineKeyboardButton, Message, SendMessage } from 'telegram-typings';
import { editMessage } from '../../utils/editMessage';
import { range } from '../../utils/range';
import { sendMessage } from '../../utils/sendMessage';

export interface RenderOptions {
	updateMessageId?: number;
	earliestDate?: Dayjs;
	select?: boolean;
}

export const renderCalendar = async (
	date: Dayjs,
	{ text, ...options }: SendMessage,
	{ updateMessageId, earliestDate, select = false }: RenderOptions = {}
): Promise<Message> => {
	const textLabel =
		text + (select ? `\n\`${date.format('D MMM YYYY')}\`` : '\n`\\[date month year\\]`');
	if (select) {
		if (updateMessageId !== undefined) {
			return editMessage({
				...options,
				text: textLabel,
				message_id: updateMessageId,
				reply_markup: undefined,
			});
		} else {
			return sendMessage({
				...options,
				text: textLabel,
				reply_markup: undefined,
			});
		}
	}
	const monthButtons = getMonthButtons(date, { select });
	const dayButtons = getDayButtons();
	const dateButtons = getDateButtons(date, { earliestDate, select });
	const inline_keyboard = monthButtons.concat(dayButtons, dateButtons);
	if (updateMessageId !== undefined) {
		return await editMessage({
			...options,
			text: textLabel,
			message_id: updateMessageId,
			reply_markup: { inline_keyboard },
		});
	} else {
		return await sendMessage({
			...options,
			text: textLabel,
			reply_markup: { inline_keyboard },
		});
	}
};

const getMonthButtons = (
	date: Dayjs,
	{ select = false }: RenderOptions
): InlineKeyboardButton[][] => {
	const monthLabel: InlineKeyboardButton = { text: date.format('MMM YYYY'), callback_data: 'NOOP' };
	if (select) {
		return [[monthLabel]];
	}
	return [
		[
			{
				text: '←',
				callback_data: 'PAGE_' + date.subtract(1, 'month').format('YYYYMMDD'),
			},
			monthLabel,
			{
				text: '→',
				callback_data: 'PAGE_' + date.add(1, 'month').format('YYYYMMDD'),
			},
		],
	];
};

const getDayButtons = (): InlineKeyboardButton[][] => {
	return [
		['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((label) => ({
			text: label,
			callback_data: 'NOOP',
		})),
	];
};

const getDateButtons = (
	date: Dayjs,
	{ earliestDate, select }: RenderOptions
): InlineKeyboardButton[][] => {
	const firstDayOffset = date.date(1).day();
	const inline_keyboard: InlineKeyboardButton[][] = [];
	let currentKeyboardRow: InlineKeyboardButton[] = range(firstDayOffset).map(() => ({
		text: ' ',
		callback_data: 'NOOP',
	}));

	for (const numOfMonth of range(1, date.daysInMonth() + 1)) {
		const dateOfMonth = date.date(numOfMonth);

		let button: InlineKeyboardButton;
		if (select) {
			if (dateOfMonth.isSame(date, 'day')) {
				button = { text: `${numOfMonth}`, callback_data: 'NOOP' };
			} else {
				button = { text: ' ', callback_data: 'NOOP' };
			}
		} else if (earliestDate !== undefined && dateOfMonth.isBefore(earliestDate, 'day')) {
			button = { text: ' ', callback_data: 'NOOP' };
		} else {
			button = { text: `${numOfMonth}`, callback_data: 'SELECT_' + dateOfMonth.format('YYYYMMDD') };
		}

		currentKeyboardRow.push(button);

		if (currentKeyboardRow.length === 7) {
			inline_keyboard.push(currentKeyboardRow);
			currentKeyboardRow = [];
		}
	}

	if (currentKeyboardRow.length !== 0) {
		for (let i = currentKeyboardRow.length; i < 7; i++) {
			currentKeyboardRow.push({ text: ' ', callback_data: 'NOOP' });
		}
		inline_keyboard.push(currentKeyboardRow);
	}

	return inline_keyboard;
};
