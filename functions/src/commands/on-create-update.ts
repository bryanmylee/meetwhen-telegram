import dayjs from 'dayjs';
import { CreateSession, CREATE_PROMPTS } from '../create/CreateSession';
import { SessionCallback } from '../session/SessionCallback';
import { calendar } from '../views/calendar';
import { promptEndDate } from './on-create-message';

export const onCreateUpdate = async (callback: SessionCallback<CreateSession>): Promise<void> => {
  switch (callback.session.latestPrompt) {
    case 'MEETING_DATE_START':
      return updateStartDate(callback);
    case 'MEETING_DATE_END':
    case 'MEETING_TIME_START':
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
      return calendar(
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
      return promptEndDate(callback.from.id, dayjs(date));
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
      return calendar(
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
