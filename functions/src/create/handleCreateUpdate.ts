import type { BindSession } from '../session/BindSession';
import type { CreateSession } from './CreateSession';
import type { Update } from 'telegram-typings';
import { promptEndDate, promptEndHour, promptStartDate, promptStartHour } from './views/prompts';
import { calendar, getCalendarPayload } from '../views/calendar';
import { CREATE_PROMPTS } from './createPrompts';
import dayjs from 'dayjs';
import { parseHour } from '../utils/parseHour';

type CreateUpdateHandler = (update: BindSession<Update, CreateSession>) => Promise<void>;

export const handleCreateUpdate: CreateUpdateHandler = async (update) => {
  const session = await update.getSession();
  const { latestPrompt } = session;
  switch (latestPrompt) {
    case 'MEETING_NAME':
      return handleNameUpdate(update);
    case 'MEETING_DATE_START':
      return handleStartDateUpdate(update);
    case 'MEETING_DATE_END':
      return handleEndDateUpdate(update);
    case 'MEETING_HOUR_START':
      return handleStartHourUpdate(update);
    case 'MEETING_HOUR_END':
      return handleEndHourUpdate(update);
    case 'CONFIRM_OR_ADVANCED':
      return handleConfirmOrMoreUpdate(update);
  }
};

export const handleNameUpdate: CreateUpdateHandler = async (update) => {
  const { message } = update.data;
  if (message === undefined) {
    return;
  }
  const name = message.text ?? '';
  if (name.length === 0) {
    throw {
      message: 'Name cannot be empty.',
    };
  }
  await Promise.all([
    promptStartDate(message.chat.id),
    update.updateSession({
      name,
      latestPrompt: 'MEETING_DATE_START',
    }),
  ]);
};

export const handleStartDateUpdate: CreateUpdateHandler = async (update) => {
  const { callback_query } = update.data;
  if (callback_query === undefined) {
    return;
  }
  const data = callback_query?.data;
  if (data === undefined) {
    return;
  }
  const { action, dateString } = getCalendarPayload(data);
  const date = dayjs(dateString);
  switch (action) {
    case 'PAGE':
      await calendar(
        date,
        {
          chat_id: callback_query.from.id,
          text: CREATE_PROMPTS.MEETING_DATE_START,
        },
        {
          updateMessageId: callback_query.message?.message_id,
          earliestDate: dayjs(),
        }
      );
      return;
    case 'SELECT':
      await Promise.all([
        calendar(
          dayjs(dateString),
          {
            chat_id: callback_query.from.id,
            text: CREATE_PROMPTS.MEETING_DATE_START,
          },
          {
            updateMessageId: callback_query.message?.message_id,
            selectedDate: date,
          }
        ),
        promptEndDate(callback_query.from.id, date),
        update.updateSession({
          startDate: dateString,
          latestPrompt: 'MEETING_DATE_END',
        }),
      ]);
      return;
  }
};

export const handleEndDateUpdate: CreateUpdateHandler = async (update) => {
  const { callback_query } = update.data;
  if (callback_query === undefined) {
    return;
  }
  const data = callback_query?.data;
  if (data === undefined) {
    return;
  }
  const { action, dateString } = getCalendarPayload(data);
  const date = dayjs(dateString);
  switch (action) {
    case 'PAGE':
      await calendar(
        date,
        {
          chat_id: callback_query.from.id,
          text: CREATE_PROMPTS.MEETING_DATE_END,
        },
        {
          updateMessageId: callback_query.message?.message_id,
          earliestDate: dayjs(),
        }
      );
      return;
    case 'SELECT':
      await Promise.all([
        calendar(
          date,
          {
            chat_id: callback_query.from.id,
            text: CREATE_PROMPTS.MEETING_DATE_START,
          },
          {
            updateMessageId: callback_query.message?.message_id,
            selectedDate: date,
          }
        ),
        promptStartHour(callback_query.from.id),
        update.updateSession({
          endDate: dateString,
          latestPrompt: 'MEETING_HOUR_START',
        }),
      ]);
      return;
  }
};

export const handleStartHourUpdate: CreateUpdateHandler = async (update) => {
  const { message } = update.data;
  if (message === undefined) {
    return;
  }
  const hour = parseHour(message.text ?? '');
  if (hour === undefined) {
    throw {
      message: `I don't understand ${message.text}. Try again?`,
    };
  }
  await Promise.all([
    promptEndHour(message.chat.id),
    update.updateSession({
      startHour: hour,
      latestPrompt: 'MEETING_HOUR_END',
    }),
  ]);
};

export const handleEndHourUpdate: CreateUpdateHandler = async (update) => {
  const { message } = update.data;
  if (message === undefined) {
    return;
  }
  const hour = parseHour(message.text ?? '');
  if (hour === undefined) {
    throw {
      message: `I don't understand ${message.text}. Try again?`,
    };
  }
  await Promise.all([
    promptEndHour(message.chat.id),
    update.updateSession({
      endHour: hour,
      latestPrompt: 'CONFIRM_OR_ADVANCED',
    }),
  ]);
};

export const handleConfirmOrMoreUpdate: CreateUpdateHandler = async (update) => {
  console.log('confirm update?', update.data);
};
