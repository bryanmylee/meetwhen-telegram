import axios from 'axios';
import type { Message, EditMessageText } from 'telegram-typings';
import { TELEGRAM_API } from '../env';
import { inspect } from 'util';

export const editMessage = async (options: EditMessageText): Promise<Message> => {
  const response = await axios.post(TELEGRAM_API + '/editMessageText', {
    parse_mode: 'MarkdownV2',
    ...options,
  });
  console.log('->', inspect(response.data, { showHidden: false, depth: null, colors: true }));
  return response.data as Message;
};
