import type { Message } from 'telegram-typings';
import * as admin from 'firebase-admin';
import { Session } from '../types/Session';
import { SessionMessage } from '../types/SessionMessage';

const sessionRepo = admin.firestore().collection('session');

export const findSessionById = async (id: string): Promise<Session> => {
  const ref = sessionRepo.doc(id);
  const data = (await ref.get()).data() as Session;
  return data;
};

export const updateSessionWithId = async (id: string, session: Session): Promise<void> => {
  const ref = sessionRepo.doc(id);
  await ref.set(session);
};

export const injectSession = async (message: Message): Promise<SessionMessage> => {
  const id = message.chat.id.toString();
  const session = await findSessionById(id);
  return {
    ...message,
    session,
    updateSession: (newSession: Session) => updateSessionWithId(id, newSession),
  };
};
