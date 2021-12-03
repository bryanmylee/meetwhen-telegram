import type { CreatePrompt } from './CreatePrompt';
import type { CreateSession } from './CreateSession';
import type { SessionMessage } from '../session/SessionMessage';

export type CreateSessionMessage = SessionMessage<CreatePrompt, CreateSession>;
