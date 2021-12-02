import dayjs from 'dayjs';
import { CreateSession, CREATE_PROMPTS } from '../types/CreateSession';
import { SessionCallback } from '../types/SessionCallback';
import { renderCalendar } from '../views/calendar';
import { promptEndDate } from './create-message';

export const onCreateUpdate = async (callback: SessionCallback<CreateSession>): Promise<void> => {
  switch (callback.session.latestPrompt) {
    case 'MEETING_DATE_START':
      await updateStartDate(callback);
      return promptEndDate(callback.from.id);
    case 'MEETING_DATE_END':
      await updateEndDate(callback);
  }
};

export const updateStartDate = async (callback: SessionCallback<CreateSession>): Promise<void> => {
  const data = callback.data;
  if (data === undefined) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [, action, date] = data.match(/(\w+)_(\w+)/)!;
  switch (action) {
    case 'PAGE':
      return renderCalendar(dayjs(date), {
        update_message_id: callback.message?.message_id,
        chat_id: callback.from.id,
        text: CREATE_PROMPTS.MEETING_DATE_START,
      });
    case 'SELECT':
      return setStartDate(callback, date);
  }
};

export const setStartDate = async (
  callback: SessionCallback<CreateSession>,
  date: string
): Promise<void> => {
  callback.updateSession({
    ...callback.session,
    startDate: date,
    latestPrompt: 'MEETING_DATE_END',
  });
};

export const updateEndDate = async (callback: SessionCallback<CreateSession>): Promise<void> => {
  const data = callback.data;
  if (data === undefined) {
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const [, action, date] = data.match(/(\w+)_(\w+)/)!;
  switch (action) {
    case 'PAGE':
      return renderCalendar(dayjs(date), {
        update_message_id: callback.message?.message_id,
        chat_id: callback.from.id,
        text: CREATE_PROMPTS.MEETING_DATE_END,
      });
    case 'SELECT':
      return setEndDate(callback, date);
  }
};

export const setEndDate = async (
  callback: SessionCallback<CreateSession>,
  date: string
): Promise<void> => {
  callback.updateSession({
    ...callback.session,
    endDate: date,
    latestPrompt: 'MEETING_TIME_START',
  });
};
