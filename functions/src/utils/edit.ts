import axios from 'axios';
import type { Message, EditMessageText } from 'telegram-typings';
import { TELEGRAM_API } from '../env';

export const edit = async (options: EditMessageText): Promise<Message> => {
  try {
    const response = await axios.post(TELEGRAM_API + '/editMessageText', {
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
