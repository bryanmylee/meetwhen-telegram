import type { Session } from './Session';
import { findSessionById, setSessionWithId, updateSessionWithId } from './repo';

export class SessionUpdater<T extends Session = Session> {
  private _session: T | undefined;

  constructor(public chatId: number, public username: string) {}

  public get sessionId(): string {
    return `${this.username}-${this.chatId}`;
  }

  public async getSession(): Promise<T> {
    if (this._session === undefined) {
      this._session = (await findSessionById(this.sessionId)) as T;
    }
    return this._session;
  }

  public async updateSession(updateSession: Partial<T>): Promise<void> {
    this._session = {
      ...this._session,
      ...updateSession,
    } as T;
    await updateSessionWithId(this.sessionId, updateSession);
  }

  public async setSession(newSession: T): Promise<void> {
    this._session = newSession as T;
    await setSessionWithId(this.sessionId, newSession);
  }

  public async resetSession(): Promise<void> {
    const timezone = (await this.getSession()).TZ;
    await setSessionWithId(this.sessionId, {
      ...(timezone ? { TZ: timezone } : {}),
    });
  }
}
