import axios from 'axios';
import type { SendMessage, Message } from 'telegram-typings';
import { TELEGRAM_API } from '../env';

export const reply = async (
  to: Message,
  options: Omit<SendMessage, 'chat_id' | 'parse_mode'>
): Promise<Message> => {
  try {
    const response = await axios.post(TELEGRAM_API + '/sendMessage', {
      parse_mode: 'MarkdownV2',
      ...options,
      chat_id: to.chat.id,
    });
    return response.data as Message;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
