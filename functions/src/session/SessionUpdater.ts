import type { Session } from './Session';
import {
  deleteSessionWithId,
  findSessionById,
  setSessionWithId,
  updateSessionWithId,
} from './repo';

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
    this._session = {
      ...this._session,
      ...updateSession,
    } as T;
    await updateSessionWithId(this.id, updateSession);
  }

  public async setSession(newSession: T): Promise<void> {
    this._session = newSession as T;
    await setSessionWithId(this.id, newSession);
  }

  public async deleteSession(): Promise<void> {
    await deleteSessionWithId(this.id);
  }
}
