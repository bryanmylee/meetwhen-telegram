import type { CalendarPayload } from './CalendarPayload';

export const getCalendarPayload = (data: string): CalendarPayload => {
  if (data === undefined) {
    return { action: 'NOOP' };
  }
  const tokens = data.match(/(\w+)_(\w+)/);
  if (tokens === null) {
    return { action: 'NOOP' };
  }
  const [, action, dateString] = tokens;
  return {
    action,
    dateString,
  } as CalendarPayload;
};
