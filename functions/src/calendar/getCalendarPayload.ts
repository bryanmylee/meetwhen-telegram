import dayjs from 'dayjs';
import type { CalendarPayload } from './CalendarPayload';

export const getPayloadFromMessage = (text: string): CalendarPayload => {
  const date = dayjs(text);
  if (date.isValid()) {
    return {
      action: 'SELECT',
      dateString: date.format('YYYYMMDD'),
    };
  }
  return { action: 'NOOP' };
};

export const getPayloadFromCallback = (data: string): CalendarPayload => {
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
