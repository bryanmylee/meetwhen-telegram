import type { Update } from 'telegram-typings';
import type { BindSession } from '../session/BindSession';
import type { CalendarPayload } from './CalendarPayload';
import { getCalendarPayload } from './getCalendarPayload';

export const handleCalendarUpdate = (update: BindSession<Update>): CalendarPayload => {
  const { callback_query } = update.data;
  if (callback_query === undefined) {
    return { action: 'NOOP' };
  }
  const data = callback_query?.data;
  if (data === undefined) {
    return { action: 'NOOP' };
  }
  return getCalendarPayload(data);
};
