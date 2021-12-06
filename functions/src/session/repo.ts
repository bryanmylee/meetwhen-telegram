import * as admin from 'firebase-admin';
import type { Session } from './Session';

const sessionRepo = admin.firestore().collection('session');

export const findSessionById = async (id: string): Promise<Session> => {
	const ref = sessionRepo.doc(id);
	const data = (await ref.get()).data() as Session;
	return data;
};

export const subscribeSessionById = (
	id: string,
	onUpdate: (data: Session) => void
): (() => void) => {
	return sessionRepo.doc(id).onSnapshot((doc) => onUpdate(doc.data() as Session));
};

export const updateSessionWithId = async (id: string, session: Partial<Session>): Promise<void> => {
	const ref = sessionRepo.doc(id);
	await ref.set(session, { merge: true });
};

export const setSessionWithId = async (id: string, session: Session): Promise<void> => {
	const ref = sessionRepo.doc(id);
	await ref.set(session);
};

export const deleteSessionWithId = async (id: string): Promise<void> => {
	const ref = sessionRepo.doc(id);
	await ref.delete();
};
