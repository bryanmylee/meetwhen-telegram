import dayjs from 'dayjs';
import type { CreateSessionCallback } from './CreateSessionCallback';
import { CREATE_PROMPTS } from './createPrompts';
import { calendar } from '../views/calendar';
import { promptEndDate, promptStartTime } from './views/prompts';

export const onCreateUpdate = async (callback: CreateSessionCallback): Promise<void> => {
  switch (callback.session.latestPrompt) {
    case 'MEETING_DATE_START':
      if (await updateStartDate(callback)) {
        return promptEndDate(callback.from.id, dayjs(callback.session.startDate));
      }
      return;
    case 'MEETING_DATE_END':
      if (await updateEndDate(callback)) {
        return promptStartTime(callback.from.id);
      }
      return;
  }
};

export const updateStartDate = async (callback: CreateSessionCallback): Promise<boolean> => {
  const data = callback.data;
  if (data === undefined) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [, action, date] = data.match(/(\w+)_(\w+)/)!;
  switch (action) {
    case 'PAGE':
      await calendar(
        dayjs(date),
        {
          chat_id: callback.from.id,
          text: CREATE_PROMPTS.MEETING_DATE_START,
        },
        {
          updateMessageId: callback.message?.message_id,
          earliestDate: dayjs(),
        }
      );
      return false;
    case 'SELECT':
      await calendar(
        dayjs(date),
        {
          chat_id: callback.from.id,
          text: CREATE_PROMPTS.MEETING_DATE_START,
        },
        {
          updateMessageId: callback.message?.message_id,
          selectedDate: dayjs(date),
        }
      );
      await setStartDate(callback, date);
      return true;
    default:
      return false;
  }
};

export const setStartDate = async (
  callback: CreateSessionCallback,
  date: string
): Promise<void> => {
  callback.updateSession({
    ...callback.session,
    startDate: date,
    latestPrompt: 'MEETING_DATE_END',
  });
};

export const updateEndDate = async (callback: CreateSessionCallback): Promise<boolean> => {
  const data = callback.data;
  if (data === undefined) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [, action, date] = data.match(/(\w+)_(\w+)/)!;
  switch (action) {
    case 'PAGE':
      await calendar(
        dayjs(date),
        {
          chat_id: callback.from.id,
          text: CREATE_PROMPTS.MEETING_DATE_END,
        },
        {
          updateMessageId: callback.message?.message_id,
          earliestDate: dayjs(callback.session.startDate, 'YYYYMMDD'),
        }
      );
      return false;
    case 'SELECT':
      await calendar(
        dayjs(date),
        {
          chat_id: callback.from.id,
          text: CREATE_PROMPTS.MEETING_DATE_END,
        },
        {
          updateMessageId: callback.message?.message_id,
          selectedDate: dayjs(date),
        }
      );
      await setEndDate(callback, date);
      return true;
    default:
      return false;
  }
};

export const setEndDate = async (callback: CreateSessionCallback, date: string): Promise<void> => {
  callback.updateSession({
    ...callback.session,
    endDate: date,
    latestPrompt: 'MEETING_TIME_START',
  });
};
