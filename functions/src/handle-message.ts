import { CreateSession } from './types/CreateSession';
import { startCreate, handleCreate } from './commands/create';
import { unrecognized } from './commands/unrecognized';
import { SessionMessage } from './types/SessionMessage';

const startSession = async (message: SessionMessage): Promise<void> => {
  switch (message.text) {
    case '/new':
      startCreate(message as SessionMessage<CreateSession>);
      return;
    default:
      unrecognized(message);
  }
};

export const handleMessage = async (message: SessionMessage): Promise<void> => {
  if (message.session === undefined) {
    return startSession(message);
  }
  switch (message.session.command) {
    case 'create':
      return handleCreate(message as SessionMessage<CreateSession>);
  }
};
