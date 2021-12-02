import type { Dayjs } from 'dayjs';
import { send } from '../utils/send';
import { InlineKeyboardButton, SendMessage } from 'telegram-typings';
import { range } from '../utils/range';
import { edit } from '../utils/edit';

export interface RenderOptions extends Omit<SendMessage, 'reply_markup'> {
  update_message_id?: number;
}

export const renderCalendar = async (
  month: Dayjs,
  { update_message_id, ...options }: RenderOptions
): Promise<void> => {
  const firstDayOffset = month.day();
  const inline_keyboard: InlineKeyboardButton[][] = [];
  let currentKeyboardRow: InlineKeyboardButton[] = range(firstDayOffset).map(() => ({
    text: ' ',
    callback_data: ' ',
  }));
  for (const date of range(month.daysInMonth())) {
    currentKeyboardRow.push({ text: date.toString(), callback_data: date.toString() });
    if (currentKeyboardRow.length === 7) {
      inline_keyboard.push(currentKeyboardRow);
      currentKeyboardRow = [];
    }
  }
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
