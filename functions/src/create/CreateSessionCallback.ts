import { SessionCallback } from '../session/SessionCallback';
import { CreatePrompt, CreateSession } from './CreateSession';

export type CreateSessionCallback = SessionCallback<CreatePrompt, CreateSession>;
