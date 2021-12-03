import type { CreateSessionCallback } from './create/CreateSessionCallback';
import type { SessionCallback } from './session/SessionCallback';
import { onCreateUpdate } from './create/on-create-update';

export const handleCallback = async (callback: SessionCallback<string>): Promise<void> => {
  switch (callback.session.command) {
    case 'new':
      return onCreateUpdate(callback as CreateSessionCallback);
  }
};
