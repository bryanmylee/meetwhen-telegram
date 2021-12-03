import type { CreatePrompt } from './CreatePrompt';
import type { Session } from '../session/Session';

export interface CreateSession extends Session<CreatePrompt> {
  MESSAGE_ID_TO_EDIT?: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  startHour?: number;
  endHour?: number;
}
