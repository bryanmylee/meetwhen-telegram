import type { Message } from 'telegram-typings';
import { reply } from '../utils/reply';

export const unrecognized = async (message: Message): Promise<void> => {
  reply(message, {
    text: 'Unrecognized command. Try again?',
  });
};
