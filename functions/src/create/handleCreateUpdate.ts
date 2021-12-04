import dayjs from 'dayjs';
import type { BindSession } from '../session/BindSession';
import type { ConfirmAction } from './ConfirmAction';
import type { CreateSession } from './CreateSession';
import type { Update } from 'telegram-typings';
import { CREATE_PROMPTS } from './createPrompts';
import { editMessage } from '../utils/editMessage';
import { parseHour } from '../utils/parseHour';
import { renderCalendar } from '../calendar/views/renderCalendar';
import {
  renderConfirm,
  renderEditEndDate,
  renderEditEndHour,
  renderEditName,
  renderEditStartDate,
  renderEditStartHour,
  renderSetEndDate,
  renderSetEndHour,
  renderSetStartDate,
  renderSetStartHour,
} from './views/renderCreate';
import { handleCalendarUpdate } from '../calendar/handleCalendarUpdate';

type CreateUpdateHandler = (
  update: BindSession<Update, CreateSession>,
  edit?: boolean
) => Promise<void>;

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
    case 'CONFIRM_OR_EDIT':
      return handleConfirmOrMoreUpdate(update);
    case 'EDIT_NAME':
      return handleNameUpdate(update, true);
    case 'EDIT_DATE_START':
      return handleStartDateUpdate(update, true);
    case 'EDIT_DATE_END':
      return handleEndDateUpdate(update, true);
    case 'EDIT_HOUR_START':
      return handleStartHourUpdate(update, true);
    case 'EDIT_HOUR_END':
      return handleEndHourUpdate(update, true);
  }
};

export const handleNameUpdate: CreateUpdateHandler = async (update, edit = false) => {
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
  const chatId = message.chat.id;
  await update.updateSession({
    name,
    LATEST_PROMPT: edit ? 'CONFIRM_OR_EDIT' : 'MEETING_DATE_START',
  });
  if (edit) {
    await renderConfirm(chatId, await update.getSession());
  } else {
    await renderSetStartDate(chatId);
  }
};

export const handleStartDateUpdate: CreateUpdateHandler = async (update, edit = false) => {
  const { callback_query } = update.data;
  if (callback_query === undefined) {
    return;
  }
  const { action, dateString } = handleCalendarUpdate(update);
  const date = dayjs(dateString);
  const chatId = callback_query.from.id;
  const messageId = callback_query.message?.message_id;
  switch (action) {
    case 'PAGE':
      await renderCalendar(
        date,
        {
          chat_id: chatId,
          text: CREATE_PROMPTS.MEETING_DATE_START,
        },
        {
          updateMessageId: messageId,
          earliestDate: dayjs(),
        }
      );
      return;
    case 'SELECT':
      renderCalendar(
        dayjs(dateString),
        {
          chat_id: chatId,
          text: CREATE_PROMPTS.MEETING_DATE_START,
        },
        {
          updateMessageId: messageId,
          selectedDate: date,
        }
      );
      await update.updateSession({
        startDate: dateString,
        LATEST_PROMPT: edit ? 'EDIT_DATE_END' : 'MEETING_DATE_END',
      });
      await renderSetEndDate(chatId, date);
      return;
  }
};

export const handleEndDateUpdate: CreateUpdateHandler = async (update, edit = false) => {
  const { callback_query } = update.data;
  if (callback_query === undefined) {
    return;
  }
  const { action, dateString } = handleCalendarUpdate(update);
  const date = dayjs(dateString);
  const chatId = callback_query.from.id;
  const messageId = callback_query.message?.message_id;
  switch (action) {
    case 'PAGE':
      await renderCalendar(
        date,
        {
          chat_id: chatId,
          text: CREATE_PROMPTS.MEETING_DATE_END,
        },
        {
          updateMessageId: messageId,
          earliestDate: dayjs(),
        }
      );
      return;
    case 'SELECT': {
      renderCalendar(
        date,
        {
          chat_id: chatId,
          text: CREATE_PROMPTS.MEETING_DATE_START,
        },
        {
          updateMessageId: messageId,
          selectedDate: date,
        }
      );
      if (edit) {
        await update.updateSession({
          endDate: dateString,
          LATEST_PROMPT: 'CONFIRM_OR_EDIT',
        });
        await renderConfirm(chatId, await update.getSession());
      } else {
        const startHourPrompt = await renderSetStartHour(chatId);
        await update.updateSession({
          endDate: dateString,
          LATEST_PROMPT: 'MEETING_HOUR_START',
          MESSAGE_ID_TO_EDIT: startHourPrompt.message_id,
        });
      }
    }
  }
};

export const handleStartHourUpdate: CreateUpdateHandler = async (update, edit = false) => {
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
  const chatId = message.chat.id;
  const session = await update.getSession();
  const startHourPromptMessageId = session.MESSAGE_ID_TO_EDIT;
  await editMessage({
    text: CREATE_PROMPTS.MEETING_HOUR_START + `\n\`${message.text}\``,
    chat_id: chatId,
    message_id: startHourPromptMessageId,
  });
  const endHourPrompt = await renderSetEndHour(chatId, hour);
  await update.updateSession({
    startHour: hour,
    LATEST_PROMPT: edit ? 'EDIT_HOUR_END' : 'MEETING_HOUR_END',
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
  const chatId = message.chat.id;
  const session = await update.getSession();
  const endHourPromptMessageId = session.MESSAGE_ID_TO_EDIT;
  await editMessage({
    text: CREATE_PROMPTS.MEETING_HOUR_END + `\n\`${message.text}\``,
    chat_id: chatId,
    message_id: endHourPromptMessageId,
  });
  await update.updateSession({
    endHour: hour,
    LATEST_PROMPT: 'CONFIRM_OR_EDIT',
  });
  await renderConfirm(message.chat.id, await update.getSession());
};

export const handleConfirmOrMoreUpdate: CreateUpdateHandler = async (update) => {
  const { callback_query } = update.data;
  if (callback_query === undefined) {
    return;
  }
  const action = callback_query.data as ConfirmAction;
  if (action === undefined) {
    await renderConfirm(callback_query.from.id, await update.getSession());
    return;
  }
  const chatId = callback_query.from.id;
  switch (action) {
    case 'SELECT_MORE':
      await renderConfirm(callback_query.from.id, await update.getSession());
      return;
    case 'EDIT_NAME':
      await Promise.all([
        update.updateSession({
          LATEST_PROMPT: 'EDIT_NAME',
        }),
        renderEditName(chatId),
      ]);
      return;
    case 'EDIT_DATE_START':
      await Promise.all([
        update.updateSession({
          LATEST_PROMPT: 'EDIT_DATE_START',
        }),
        renderEditStartDate(chatId),
      ]);
      return;
    case 'EDIT_DATE_END':
      await Promise.all([
        update.updateSession({
          LATEST_PROMPT: 'EDIT_DATE_END',
        }),
        renderEditEndDate(chatId, dayjs((await update.getSession()).startDate)),
      ]);
      return;
    case 'EDIT_HOUR_START': {
      const message = await renderEditStartHour(chatId);
      await update.updateSession({
        LATEST_PROMPT: 'EDIT_HOUR_START',
        MESSAGE_ID_TO_EDIT: message.message_id,
      });
      return;
    }
    case 'EDIT_HOUR_END': {
      const message = await renderEditEndHour(chatId, (await update.getSession()).startHour ?? 0);
      await update.updateSession({
        LATEST_PROMPT: 'EDIT_HOUR_START',
        MESSAGE_ID_TO_EDIT: message.message_id,
      });
      return;
    }
  }
};
