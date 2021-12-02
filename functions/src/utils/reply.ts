import axios from 'axios';
import type { SendMessage, Message } from 'telegram-typings';
import { TELEGRAM_API } from '../env';

export const reply = async (
  to: Message,
  options: Omit<SendMessage, 'chat_id'>
): Promise<Message> => {
  const response = await axios.post(TELEGRAM_API + '/sendMessage', {
    ...options,
    chat_id: to.chat.id,
  });
  return response.data as Message;
};
