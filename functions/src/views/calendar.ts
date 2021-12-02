import type { Dayjs } from 'dayjs';
import { InlineKeyboardButton, SendMessage } from 'telegram-typings';
import { edit } from '../utils/edit';
import { range } from '../utils/range';
import { send } from '../utils/send';

export interface RenderOptions {
  updateMessageId?: number;
  earliestDate?: Dayjs;
  selectedDate?: Dayjs;
}

export const renderCalendar = async (
  date: Dayjs,
  { text, ...options }: SendMessage,
  { updateMessageId, earliestDate, selectedDate }: RenderOptions = {}
): Promise<void> => {
  const monthButtons = getMonthButtons(date);
  const dateButtons = getDateButtons(date, { earliestDate, selectedDate });
  const inline_keyboard = monthButtons.concat(dateButtons);
  const withSelectedText =
    text + (selectedDate !== undefined ? ` \\(${selectedDate.format('D MMM YYYY')}\\)` : '');
  if (updateMessageId !== undefined) {
    edit({
      ...options,
      text: withSelectedText,
      message_id: updateMessageId,
      reply_markup: { inline_keyboard },
    });
  } else {
    send({
      ...options,
      text: withSelectedText,
      reply_markup: { inline_keyboard },
    });
  }
};

const getMonthButtons = (date: Dayjs): InlineKeyboardButton[][] => {
  return [
    [
      {
        text: '<',
        callback_data: 'PAGE_' + date.subtract(1, 'month').format('YYYYMMDD'),
      },
      {
        text: date.format('MMM YYYY'),
        callback_data: 'NOOP_' + date.format('YYYYMMDD'),
      },
      {
        text: '>',
        callback_data: 'PAGE_' + date.add(1, 'month').format('YYYYMMDD'),
      },
    ],
  ];
};

const getDateButtons = (
  date: Dayjs,
  { earliestDate, selectedDate }: RenderOptions
): InlineKeyboardButton[][] => {
  const firstDayOffset = date.day();
  const inline_keyboard: InlineKeyboardButton[][] = [];
  let currentKeyboardRow: InlineKeyboardButton[] = range(firstDayOffset).map(() => ({
    text: ' ',
    callback_data: 'NOOP_' + date.format('YYYYMMDD'),
  }));

  for (const numOfMonth of range(1, date.daysInMonth() + 1)) {
    const dateOfMonth = date.date(numOfMonth);
    if (selectedDate !== undefined && !dateOfMonth.isSame(selectedDate, 'day')) {
      currentKeyboardRow.push({
        text: ' ',
        callback_data: 'NOOP_' + dateOfMonth.format('YYYYMMDD'),
      });
    } else if (earliestDate !== undefined && dateOfMonth.isBefore(earliestDate, 'day')) {
      currentKeyboardRow.push({
        text: ' ',
        callback_data: 'NOOP_' + dateOfMonth.format('YYYYMMDD'),
      });
    } else {
      currentKeyboardRow.push({
        text: numOfMonth.toString(),
        callback_data: 'SELECT_' + dateOfMonth.format('YYYYMMDD'),
      });
    }
    if (currentKeyboardRow.length === 7) {
      inline_keyboard.push(currentKeyboardRow);
      currentKeyboardRow = [];
    }
  }

  if (currentKeyboardRow.length !== 0) {
    for (let i = currentKeyboardRow.length; i < 7; i++) {
      currentKeyboardRow.push({
        text: ' ',
        callback_data: 'NOOP_' + date.format('YYYYMMDD'),
      });
    }
    inline_keyboard.push(currentKeyboardRow);
  }

  return inline_keyboard;
};
