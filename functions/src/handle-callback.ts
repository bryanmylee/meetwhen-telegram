import { onCreateUpdate } from './commands/on-create-update';
import { CreateSession } from './create/CreateSession';
import { SessionCallback } from './session/SessionCallback';

export const handleCallback = async (callback: SessionCallback): Promise<void> => {
  switch (callback.session.command) {
    case 'create':
      return onCreateUpdate(callback as SessionCallback<CreateSession>);
  }
};
