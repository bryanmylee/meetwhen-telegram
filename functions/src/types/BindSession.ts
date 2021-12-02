import { Session } from './Session';

export interface BindSession<T extends Session = Session> {
  session: T;
  updateSession: (newSession: T) => Promise<void>;
}
