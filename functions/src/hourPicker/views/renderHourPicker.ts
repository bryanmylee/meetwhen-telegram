import type { InlineKeyboardButton, Message, SendMessage } from 'telegram-typings';
import { editMessage } from '../../utils/editMessage';
import { formatHour } from '../../utils/formatHour';
import { range } from '../../utils/range';
import { sendMessage } from '../../utils/sendMessage';

export interface RenderOptions {
  updateMessageId?: number;
  selectedHour?: number;
}

export const renderHourPicker = async (
  hour: number,
  { text, ...options }: SendMessage,
  { updateMessageId, selectedHour }: RenderOptions = {}
): Promise<Message> => {
  const startHourLabel = formatHour(hour);
  const textLabel =
    text +
    (selectedHour !== undefined
      ? `\n\`${formatHour(selectedHour)}\``
      : `\n\`\\[${startHourLabel}-${startHourLabel}\\]\``);
  if (selectedHour !== undefined) {
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
  const toggle = getAmPmToggle(hour);
  const hourButtons = getHourOptions(hour);
  const inline_keyboard = toggle.concat(hourButtons);
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

export const getAmPmToggle = (hour: number): InlineKeyboardButton[][] => {
  if (hour < 12 || hour === 24) {
    return [[{ text: 'am / pm', callback_data: `PAGE_${hour}pm` }]];
  }
  return [[{ text: 'am / pm', callback_data: `PAGE_${hour}am` }]];
};

const getSelectButton = (hour: number): InlineKeyboardButton => {
  return {
    text: formatHour(hour),
    callback_data: `SELECT_${formatHour(hour)}`,
  };
};

export const getHourOptions = (hour: number): InlineKeyboardButton[][] => {
  const offset = hour < 12 ? 0 : 12;
  return [
    range(offset + 1, offset + 5).map(getSelectButton),
    range(offset + 5, offset + 9).map(getSelectButton),
    range(offset + 9, offset + 13).map(getSelectButton),
  ];
};