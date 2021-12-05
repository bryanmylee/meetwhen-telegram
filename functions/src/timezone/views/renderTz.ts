import type { KeyboardButton, Message } from 'telegram-typings';
import { range } from '../../utils/range';
import { sendMessage } from '../../utils/sendMessage';
import { getTzLabel } from '../getTzLabel';
import { TZ_PROMPTS } from '../tzPrompts';

export const renderAskForLocation = async (chat_id: number): Promise<Message> => {
  return await sendMessage({
    chat_id,
    text: TZ_PROMPTS.SET_TZ_LOCATION,
    reply_markup: {
      keyboard: [
        [
          {
            text: 'Use location',
            request_location: true,
          },
          {
            text: 'Set manually',
          },
        ],
      ],
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
};

export const renderAskForManualTz = async (chat_id: number): Promise<Message> => {
  const tzButtons: KeyboardButton[][] = range(-12, 15).map((utcOffset) => {
    return [
      {
        text: getTzLabel(utcOffset),
      },
    ];
  });
  return await sendMessage({
    chat_id,
    text: TZ_PROMPTS.SET_TZ_MANUAL,
    reply_markup: {
      keyboard: tzButtons,
      one_time_keyboard: true,
      resize_keyboard: true,
    },
  });
};
