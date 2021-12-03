import type { SendMessage, Message } from 'telegram-typings';
import { sendMessage } from './sendMessage';

export const replyToMessage = async (
  to: Message,
  options: Omit<SendMessage, 'chat_id' | 'parse_mode'>
): Promise<Message> => {
  return sendMessage({
    ...options,
    chat_id: to.chat.id,
  });
};
