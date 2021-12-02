import dayjs from 'dayjs';
import { CreateSession, CREATE_PROMPTS } from '../types/CreateSession';
import { reply } from '../utils/reply';
import { range } from '../utils/range';
import { SessionMessage } from '../types/SessionMessage';
import { InlineKeyboardButton } from 'telegram-typings';

export const startCreate = async (message: SessionMessage<CreateSession>): Promise<void> => {
  message.updateSession({
    command: 'create',
    latestPrompt: 'MEETING_NAME',
  });
  await reply(message, {
    text: '*Creating a new meet\\!*',
  });
  promptMeetingName(message);
};

export const handleCreate = async (message: SessionMessage<CreateSession>): Promise<void> => {
  switch (message.session.latestPrompt) {
    case 'MEETING_NAME':
      setMeetingName(message);
      return promptStartDate(message);
    case 'MEETING_DATE_START':
      return promptStartDate(message);
  }
};

export const promptMeetingName = async (message: SessionMessage<CreateSession>): Promise<void> => {
  await reply(message, {
    text: CREATE_PROMPTS.MEETING_NAME,
  });
};

export const setMeetingName = async (message: SessionMessage<CreateSession>): Promise<void> => {
  message.updateSession({
    ...message.session,
    meetingName: message.text,
    latestPrompt: 'MEETING_DATE_START',
  });
};

export const promptStartDate = async (message: SessionMessage<CreateSession>): Promise<void> => {
  const month = dayjs(message.session.UI_DATE_PICKER_MONTH ?? dayjs().date(1).format('YYYYMMDD'));
  const firstDayOffset = month.day();
  const inline_keyboard: InlineKeyboardButton[][] = [];
  let currentKeyboardRow: InlineKeyboardButton[] = range(firstDayOffset).map(() => ({
    text: ' ',
    callback_data: ' ',
  }));
  for (const date of range(month.daysInMonth())) {
    currentKeyboardRow.push({ text: date.toString(), callback_data: date.toString() });
    if (currentKeyboardRow.length === 7) {
      inline_keyboard.push(currentKeyboardRow);
      currentKeyboardRow = [];
    }
  }
  reply(message, {
    text: CREATE_PROMPTS.MEETING_DATE_START,
    reply_markup: { inline_keyboard },
  });
};
