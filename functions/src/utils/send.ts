import axios from 'axios';
import type { SendMessage, Message } from 'telegram-typings';
import { TELEGRAM_API } from '../env';

export const send = async (options: SendMessage): Promise<Message> => {
  const response = await axios.post(TELEGRAM_API + '/sendMessage', options);
  return response.data as Message;
};
