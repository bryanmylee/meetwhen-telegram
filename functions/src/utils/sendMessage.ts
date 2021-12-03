import axios from 'axios';
import type { SendMessage, Message } from 'telegram-typings';
import { TELEGRAM_API } from '../env';

export const sendMessage = async (options: SendMessage): Promise<Message> => {
  try {
    const response = await axios.post(TELEGRAM_API + '/sendMessage', {
      parse_mode: 'MarkdownV2',
      ...options,
    });
    console.log('->', response.data);
    return response.data as Message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
