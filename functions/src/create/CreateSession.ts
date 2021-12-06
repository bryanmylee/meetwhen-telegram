import type { Session } from '../session/Session';
import type { CreatePrompt } from './CreatePrompt';

export interface CreateSession extends Session<CreatePrompt> {
	name?: string;
	startDate?: string;
	endDate?: string;
	startHour?: number;
	endHour?: number;
}
