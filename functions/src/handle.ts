import type { Message } from 'telegram-typings';
import { findSessionById } from './db/sessions';
import { handleCreate } from './commands/create/handle-create';
import { unrecognized } from './commands/unrecognized';
import { CreateSession } from './types/CreateSession';
import { startCreate } from './commands/create/start-create';

const startSession = async (message: Message): Promise<void> => {
  switch (message.text) {
    case '/new':
      startCreate(message);
      break;
    default:
      unrecognized(message);
  }
};

export const handleMessage = async (message: Message): Promise<void> => {
  const currentSession = await findSessionById(message.chat.id.toString());
  if (currentSession === undefined) {
    return startSession(message);
  }
  switch (currentSession.command) {
    case 'create':
      return handleCreate(currentSession as CreateSession, message);
  }
};
