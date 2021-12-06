import type { CalendarAction } from './CalendarAction';

export interface CalendarPayload {
	action: CalendarAction;
	dateString?: string;
}
