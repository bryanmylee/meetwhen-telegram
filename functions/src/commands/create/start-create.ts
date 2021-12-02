import type { CreateSession } from '../../types/CreateSession';
import type { Message } from 'telegram-typings';
import { CREATE_PROMPTS } from '../../types/CreateSession';
import { reply } from '../../utils/reply';
import { updateSessionWithId } from '../../db/sessions';

export const startCreate = async (message: Message): Promise<void> => {
  const session: CreateSession = {
    command: 'create',
    latestPrompt: 'MEETING_NAME',
  };

  updateSessionWithId(message.chat.id.toString(), session);

  await reply(message, {
    text: '*Creating a new meet\\!*',
  });
  await reply(message, {
    text: CREATE_PROMPTS.MEETING_NAME,
  });
};
