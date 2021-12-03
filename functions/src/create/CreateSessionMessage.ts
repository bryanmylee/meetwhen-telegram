import { SessionMessage } from '../session/SessionMessage';
import { CreatePrompt, CreateSession } from './CreateSession';

export type CreateSessionMessage = SessionMessage<CreatePrompt, CreateSession>;
