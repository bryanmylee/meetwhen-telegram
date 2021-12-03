import type { Session } from './Session';
import { findSessionById, subscribeSessionById, updateSessionWithId } from './repo';

export interface SessionSubscriber<T extends Session = Session> {
  session: T;
  updateSession: (newSession: T) => Promise<void>;
}

export const liveSession = async <T extends Session = Session>(
  id: string
): Promise<[SessionSubscriber<T>, () => void]> => {
  let session = (await findSessionById(id)) as T;
  const unsubscribe = subscribeSessionById(id, (newSession) => (session = newSession as T));
  return [
    {
      get session() {
        return session;
      },
      updateSession: (newSession: T) => updateSessionWithId(id, newSession),
    },
    unsubscribe,
  ];
};
