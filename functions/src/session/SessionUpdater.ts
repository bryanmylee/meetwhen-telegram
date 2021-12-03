import type { Session } from './Session';
import { findSessionById, setSessionWithId, updateSessionWithId } from './repo';

export class SessionUpdater<T extends Session = Session> {
  private _session: T | undefined;
  constructor(private id: string) {}

  public async getSession(): Promise<T> {
    if (this._session === undefined) {
      this._session = (await findSessionById(this.id)) as T;
    }
    return this._session;
  }

  public async updateSession(updateSession: Partial<T>): Promise<void> {
    await updateSessionWithId(this.id, updateSession);
  }

  public async setSession(newSession: T): Promise<void> {
    await setSessionWithId(this.id, newSession);
  }
}
