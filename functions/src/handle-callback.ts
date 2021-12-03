import { onCreateUpdate } from './create/on-create-update';
import { SessionCallback } from './session/SessionCallback';
import { CreateSessionCallback } from './create/CreateSessionCallback';

export const handleCallback = async (callback: SessionCallback<string>): Promise<void> => {
  switch (callback.session.command) {
    case 'new':
      return onCreateUpdate(callback as CreateSessionCallback);
  }
};
