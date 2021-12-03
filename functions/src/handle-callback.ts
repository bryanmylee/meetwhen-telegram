import { onCreateUpdate } from './commands/on-create-update';
import { CreateSession } from './types/create/CreateSession';
import { SessionCallback } from './types/session/SessionCallback';

export const handleCallback = async (callback: SessionCallback): Promise<void> => {
  switch (callback.session.command) {
    case 'create':
      return onCreateUpdate(callback as SessionCallback<CreateSession>);
  }
};
