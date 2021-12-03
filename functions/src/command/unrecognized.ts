import type { Message } from 'telegram-typings';
import { replyToMessage } from '../utils/replyToMessage';

export const unrecognized = async (message: Message): Promise<void> => {
  replyToMessage(message, {
    text: 'Unrecognized command. Try again?',
  });
};
