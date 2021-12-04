import type { Message } from 'telegram-typings';
import { sendMessage } from '../../utils/sendMessage';
import { INTRO_PROMPTS } from '../introPrompts';

export const renderStartIntro = async (chat_id: number): Promise<Message> => {
  return await sendMessage({
    chat_id,
    text: INTRO_PROMPTS.SET_TZ_LOCATION,
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
