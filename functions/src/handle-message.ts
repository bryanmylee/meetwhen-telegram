import type { CreateSessionMessage } from './create/CreateSessionMessage';
import type { SessionMessage } from './session/SessionMessage';
import { startCreate, onCreateMessage } from './create/on-create-message';
import { unrecognized } from './command/unrecognized';

const startSession = async (message: SessionMessage<string>): Promise<void> => {
  switch (message.text) {
    case '/new':
      startCreate(message as CreateSessionMessage);
      return;
    default:
      unrecognized(message);
  }
};

export const handleMessage = async (message: SessionMessage<string>): Promise<void> => {
  if (message.session === undefined) {
    return startSession(message);
  }
  switch (message.session.command) {
    case 'new':
      return onCreateMessage(message as CreateSessionMessage);
  }
};
