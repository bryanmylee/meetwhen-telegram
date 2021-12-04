import dayjs from 'dayjs';
import type { BindSession } from '../session/BindSession';
import type { ConfirmAction } from './ConfirmAction';
import type { CreateSession } from './CreateSession';
import type { Update } from 'telegram-typings';
import { CREATE_PROMPTS } from './createPrompts';
import { confirmCreate } from './confirmCreate';
import { deleteMessage } from '../utils/deleteMessage';
import { handleCalendarUpdate } from '../calendar/handleCalendarUpdate';
import { handleHourPickerUpdate } from '../hourPicker/handleHourPickerUpdate';
import { renderCalendar } from '../calendar/views/renderCalendar';
import {
  renderCancel,
  renderConfirm,
  renderDone,
  renderSetEndDate,
  renderSetEndHour,
  renderSetName,
  renderSetStartDate,
  renderSetStartHour,
} from './views/renderCreate';
import { renderHourPicker } from '../hourPicker/views/renderHourPicker';

type CreateUpdateHandler = (
  update: BindSession<Update, CreateSession>,
  edit?: boolean
) => Promise<void>;

export const handleCreateUpdate: CreateUpdateHandler = async (update) => {
  const session = await update.getSession();
  const { LATEST_PROMPT } = session;
  switch (LATEST_PROMPT) {
    case 'MEETING_NAME':
      return await handleNameUpdate(update);
    case 'MEETING_DATE_START':
      return await handleStartDateUpdate(update);
    case 'MEETING_DATE_END':
      return await handleEndDateUpdate(update);
    case 'MEETING_HOUR_START':
      return await handleStartHourUpdate(update);
    case 'MEETING_HOUR_END':
      return await handleEndHourUpdate(update);
    case 'CONFIRM_OR_EDIT':
      return await handleConfirmOrEdit(update);
    case 'EDIT_NAME':
      return await handleNameUpdate(update, true);
    case 'EDIT_DATE_START':
      return await handleStartDateUpdate(update, true);
    case 'EDIT_DATE_END':
      return await handleEndDateUpdate(update, true);
    case 'EDIT_HOUR_START':
      return await handleStartHourUpdate(update, true);
    case 'EDIT_HOUR_END':
      return await handleEndHourUpdate(update, true);
  }
};

export const handleNameUpdate: CreateUpdateHandler = async (update, edit = false) => {
  const { message } = update.data;
  if (message === undefined) {
    return;
  }
  const name = message.text ?? '';
  if (name.length === 0) {
    throw new Error('The name cannot be empty\\.');
  }
  const { chatId } = update;
  if (edit) {
    await update.updateSession({
      name,
      LATEST_PROMPT: 'CONFIRM_OR_EDIT',
    });
    await renderConfirm(chatId, await update.getSession());
  } else {
    const message = await renderSetStartDate(chatId);
    await update.updateSession({
      name,
      LATEST_PROMPT: 'MEETING_DATE_START',
      MESSAGE_ID_TO_EDIT: message.message_id,
    });
  }
};

export const handleStartDateUpdate: CreateUpdateHandler = async (update, edit = false) => {
  const { message, callback_query } = update.data;
  if (message === undefined && callback_query === undefined) {
    return;
  }
  const { action, dateString } = handleCalendarUpdate(update);
  if (action === 'INVALID') {
    throw new Error(`I don't understand ${dateString}\\. Try again?`);
  }
  const date = dayjs(dateString);
  if (date.isBefore(dayjs(), 'day')) {
    throw new Error('You cannot start before today\\.');
  }
  const { chatId } = update;
  const messageId =
    callback_query?.message?.message_id ?? (await update.getSession()).MESSAGE_ID_TO_EDIT;
  await renderCalendar(
    date,
    { chat_id: chatId, text: CREATE_PROMPTS.MEETING_DATE_START },
    { updateMessageId: messageId, earliestDate: dayjs(), select: action === 'SELECT' }
  );
  if (action === 'SELECT') {
    const message = await renderSetEndDate(chatId, date);
    await update.updateSession({
      startDate: dateString,
      LATEST_PROMPT: edit ? 'EDIT_DATE_END' : 'MEETING_DATE_END',
      MESSAGE_ID_TO_EDIT: message.message_id,
    });
  }
};

export const handleEndDateUpdate: CreateUpdateHandler = async (update, edit = false) => {
  const { message, callback_query } = update.data;
  if (message === undefined && callback_query === undefined) {
    return;
  }
  const { action, dateString } = handleCalendarUpdate(update);
  if (action === 'INVALID') {
    throw new Error(`I don't understand ${dateString}\\. Try again?`);
  }
  const date = dayjs(dateString);
  if (action === 'SELECT' && date.isBefore(dayjs(), 'day')) {
    throw new Error('You cannot end before today\\.');
  }
  const session = await update.getSession();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const startDate = dayjs(session.startDate!);
  if (action === 'SELECT' && date.isBefore(startDate)) {
    throw new Error('You cannot end before you start\\.');
  }
  const { chatId } = update;
  const messageId = callback_query?.message?.message_id ?? session.MESSAGE_ID_TO_EDIT;
  await renderCalendar(
    date,
    { chat_id: chatId, text: CREATE_PROMPTS.MEETING_DATE_END },
    { updateMessageId: messageId, earliestDate: startDate, select: action === 'SELECT' }
  );
  if (action === 'SELECT') {
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
};

export const handleStartHourUpdate: CreateUpdateHandler = async (update, edit = false) => {
  const { message, callback_query } = update.data;
  if (message === undefined && callback_query === undefined) {
    return;
  }
  const { action, hour, hourString } = handleHourPickerUpdate(update);
  console.log({ action, hour, hourString });
  if (hour === undefined) {
    throw new Error(`I don't understand ${hourString}\\. Try again?`);
  }
  const { chatId } = update;
  const session = await update.getSession();
  const messageId = callback_query?.message?.message_id ?? session.MESSAGE_ID_TO_EDIT;
  await renderHourPicker(
    hour,
    { chat_id: chatId, text: CREATE_PROMPTS.MEETING_HOUR_START },
    { updateMessageId: messageId, select: action === 'SELECT' }
  );
  if (action === 'SELECT') {
    const endHourPrompt = await renderSetEndHour(chatId, hour);
    await update.updateSession({
      startHour: hour,
      LATEST_PROMPT: edit ? 'EDIT_HOUR_END' : 'MEETING_HOUR_END',
      MESSAGE_ID_TO_EDIT: endHourPrompt.message_id,
    });
  }
};

export const handleEndHourUpdate: CreateUpdateHandler = async (update) => {
  const { message, callback_query } = update.data;
  if (message === undefined && callback_query === undefined) {
    return;
  }
  const { action, hour, hourString } = handleHourPickerUpdate(update);
  if (hour === undefined) {
    throw new Error(`I don't understand ${hourString}\\. Try again?`);
  }
  const { chatId } = update;
  const session = await update.getSession();
  const messageId = callback_query?.message?.message_id ?? session.MESSAGE_ID_TO_EDIT;
  await renderHourPicker(
    hour,
    { chat_id: chatId, text: CREATE_PROMPTS.MEETING_HOUR_END },
    { updateMessageId: messageId, select: action === 'SELECT' }
  );
  if (action === 'SELECT') {
    await update.updateSession({
      endHour: hour,
      LATEST_PROMPT: 'CONFIRM_OR_EDIT',
    });
    await renderConfirm(chatId, await update.getSession());
  }
};

export const handleConfirmOrEdit: CreateUpdateHandler = async (update) => {
  const { callback_query } = update.data;
  if (callback_query === undefined) {
    return;
  }
  const action = callback_query.data as ConfirmAction;
  if (action === undefined) {
    await renderConfirm(callback_query.from.id, await update.getSession());
    return;
  }
  const { chatId } = update;
  switch (action) {
    case 'SELECT_CONFIRM': {
      const meeting = await confirmCreate(update);
      await renderDone(chatId, meeting);
      await update.deleteSession();
      break;
    }
    case 'SELECT_CANCEL': {
      await renderCancel(chatId);
      await update.deleteSession();
      break;
    }
    case 'EDIT_NAME':
      await Promise.all([
        update.updateSession({
          LATEST_PROMPT: 'EDIT_NAME',
        }),
        renderSetName(chatId),
      ]);
      break;
    case 'EDIT_DATE_START': {
      const message = await renderSetStartDate(chatId);
      await update.updateSession({
        LATEST_PROMPT: 'EDIT_DATE_START',
        MESSAGE_ID_TO_EDIT: message.message_id,
      });
      break;
    }
    case 'EDIT_DATE_END': {
      const session = await update.getSession();
      const message = await renderSetEndDate(chatId, dayjs(session.startDate));
      await update.updateSession({
        LATEST_PROMPT: 'EDIT_DATE_END',
        MESSAGE_ID_TO_EDIT: message.message_id,
      });
      break;
    }
    case 'EDIT_HOUR_START': {
      const message = await renderSetStartHour(chatId);
      await update.updateSession({
        LATEST_PROMPT: 'EDIT_HOUR_START',
        MESSAGE_ID_TO_EDIT: message.message_id,
      });
      break;
    }
    case 'EDIT_HOUR_END': {
      const message = await renderSetEndHour(chatId, (await update.getSession()).startHour ?? 0);
      await update.updateSession({
        LATEST_PROMPT: 'EDIT_HOUR_START',
        MESSAGE_ID_TO_EDIT: message.message_id,
      });
      break;
    }
  }
  await deleteMessage({
    chat_id: chatId,
    message_id: callback_query.message?.message_id ?? 0,
  });
};
