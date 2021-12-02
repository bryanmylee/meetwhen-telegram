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
  const withSelectedText =
    text + (selectedDate !== undefined ? ` \`\\[${selectedDate.format('D MMM YYYY')}\\]\`` : '');
  if (selectedDate !== undefined) {
    if (updateMessageId !== undefined) {
      await edit({
        ...options,
        text: withSelectedText,
        message_id: updateMessageId,
        reply_markup: undefined,
      });
    } else {
      await send({
        ...options,
        text: withSelectedText,
        reply_markup: undefined,
      });
    }
    return;
  }
  const monthButtons = getMonthButtons(date, { selectedDate });
  const dayButtons = getDayButtons();
  const dateButtons = getDateButtons(date, { earliestDate, selectedDate });
  const inline_keyboard = monthButtons.concat(dayButtons, dateButtons);
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

const getMonthButtons = (
  date: Dayjs,
  { selectedDate }: RenderOptions
): InlineKeyboardButton[][] => {
  const monthLabel: InlineKeyboardButton = { text: date.format('MMM YYYY'), callback_data: 'NOOP' };
  if (selectedDate !== undefined) {
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
  { earliestDate, selectedDate }: RenderOptions
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
    if (selectedDate !== undefined) {
      if (dateOfMonth.isSame(selectedDate, 'day')) {
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
