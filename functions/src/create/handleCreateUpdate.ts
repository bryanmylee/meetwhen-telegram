import dayjs from 'dayjs';
import type { BindSession } from '../session/BindSession';
import type { CreateSession } from './CreateSession';
import type { Update } from 'telegram-typings';
import { CREATE_PROMPTS } from './createPrompts';
import { calendar, getCalendarPayload } from '../views/calendar';
import { editMessage } from '../utils/editMessage';
import { parseHour } from '../utils/parseHour';
import { promptEndDate, promptEndHour, promptStartDate, promptStartHour } from './views/prompts';

type CreateUpdateHandler = (update: BindSession<Update, CreateSession>) => Promise<void>;

export const handleCreateUpdate: CreateUpdateHandler = async (update) => {
  const session = await update.getSession();
  const { LATEST_PROMPT } = session;
  switch (LATEST_PROMPT) {
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
      LATEST_PROMPT: 'MEETING_DATE_START',
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
          LATEST_PROMPT: 'MEETING_DATE_END',
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
    case 'SELECT': {
      const startHourPrompt = await promptStartHour(callback_query.from.id);
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
        update.updateSession({
          endDate: dateString,
          LATEST_PROMPT: 'MEETING_HOUR_START',
          MESSAGE_ID_TO_EDIT: startHourPrompt.message_id,
        }),
      ]);
    }
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
  const session = await update.getSession();
  const startHourPromptMessageId = session.MESSAGE_ID_TO_EDIT;
  await editMessage({
    text: CREATE_PROMPTS.MEETING_HOUR_START + `\n\`${message.text}\``,
    chat_id: message.chat.id,
    message_id: startHourPromptMessageId,
  });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const endHourPrompt = await promptEndHour(message.chat.id, hour);
  await update.updateSession({
    startHour: hour,
    LATEST_PROMPT: 'MEETING_HOUR_END',
    MESSAGE_ID_TO_EDIT: endHourPrompt.message_id,
  });
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
  const session = await update.getSession();
  const endHourPromptMessageId = session.MESSAGE_ID_TO_EDIT;
  await editMessage({
    text: CREATE_PROMPTS.MEETING_HOUR_END + `\n\`${message.text}\``,
    chat_id: message.chat.id,
    message_id: endHourPromptMessageId,
  });
  await update.updateSession({
    endHour: hour,
    LATEST_PROMPT: 'CONFIRM_OR_ADVANCED',
  });
};

export const handleConfirmOrMoreUpdate: CreateUpdateHandler = async (update) => {
  console.log('confirm update?', update.data);
};
