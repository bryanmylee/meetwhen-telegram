import * as admin from 'firebase-admin';
import { Session } from '../types/Session';

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
