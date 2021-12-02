import type { Message } from 'telegram-typings';
import { Session } from './Session';

export interface SessionMessage<T extends Session = Session> extends Message {
  session: T;
  updateSession: (newSession: T) => Promise<void>;
}
