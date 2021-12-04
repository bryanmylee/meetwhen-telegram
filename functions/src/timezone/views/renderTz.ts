import type { Message } from 'telegram-typings';
import { sendMessage } from '../../utils/sendMessage';
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
