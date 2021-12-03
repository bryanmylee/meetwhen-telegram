import type { CreatePrompt } from './CreatePrompt';
import type { Session } from '../session/Session';

export interface CreateSession extends Session<CreatePrompt> {
  meetingName?: string;
  startDate?: string;
  endDate?: string;
  startHour?: number;
  endHour?: number;
}
