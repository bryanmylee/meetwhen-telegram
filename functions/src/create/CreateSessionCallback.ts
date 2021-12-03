import type { CreatePrompt } from './CreatePrompt';
import type { CreateSession } from './CreateSession';
import type { SessionCallback } from '../session/SessionCallback';

export type CreateSessionCallback = SessionCallback<CreatePrompt, CreateSession>;
