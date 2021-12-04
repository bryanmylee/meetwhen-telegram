import type { Message } from 'telegram-typings';
import { sendMessage } from '../../utils/sendMessage';

export const renderStartIntro = async (chat_id: number): Promise<Message> => {
  return await sendMessage({
    chat_id,
    text: `
Welcome to the meetwhen\\.io bot\\!
Get started by setting your timezone.
    `,
  });
};
