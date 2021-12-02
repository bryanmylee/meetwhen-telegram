import type { Dayjs } from 'dayjs';
import { send } from '../utils/send';
import { InlineKeyboardButton, SendMessage } from 'telegram-typings';
import { range } from '../utils/range';
import { edit } from '../utils/edit';

export interface RenderOptions extends Omit<SendMessage, 'reply_markup'> {
  update_message_id?: number;
}

export const renderCalendar = async (
  date: Dayjs,
  { update_message_id, ...options }: RenderOptions
): Promise<void> => {
  const monthButtons = getMonthButtons(date);
  const dateButtons = getDateButtons(date);
  const inline_keyboard = monthButtons.concat(dateButtons);
  if (update_message_id !== undefined) {
    edit({
      ...options,
      message_id: update_message_id,
      reply_markup: { inline_keyboard },
    });
  } else {
    send({
      ...options,
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

const getDateButtons = (date: Dayjs): InlineKeyboardButton[][] => {
  const firstDayOffset = date.day();
  console.log(firstDayOffset);
  const inline_keyboard: InlineKeyboardButton[][] = [];
  let currentKeyboardRow: InlineKeyboardButton[] = range(firstDayOffset).map(() => ({
    text: ' ',
    callback_data: 'NOOP_' + date.format('YYYYMMDD'),
  }));

  for (const dateOfMonth of range(1, date.daysInMonth() + 1)) {
    currentKeyboardRow.push({
      text: dateOfMonth.toString(),
      callback_data: 'SELECT_' + date.date(dateOfMonth).format('YYYYMMDD'),
    });
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
