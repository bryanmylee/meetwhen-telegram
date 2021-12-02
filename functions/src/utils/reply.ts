import type { SendMessage, Message } from 'telegram-typings';
import { send } from './send';

export const reply = async (
  to: Message,
  options: Omit<SendMessage, 'chat_id' | 'parse_mode'>
): Promise<Message> => {
  return send({
    ...options,
    chat_id: to.chat.id,
  });
};
