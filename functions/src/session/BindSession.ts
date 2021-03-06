import type { Session } from './Session';
import { SessionUpdater } from './SessionUpdater';

// export type BindSession<Base, T extends Session = Session> = Base & SessionUpdater<T>;
export class BindSession<Base, T extends Session = Session> extends SessionUpdater<T> {
	constructor(chatId: number, username: string, public data: Base) {
		super(chatId, username);
	}
}
