import type { IntroPrompt } from './IntroPrompt';
import type { Session } from '../session/Session';

export interface IntroSession extends Session<IntroPrompt> {
  MESSAGE_ID_TO_EDIT?: number;
  timezone?: string;
}
