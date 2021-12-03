import { parseHour } from '../utils/parseHour';
import type { CreateSessionMessage } from './CreateSessionMessage';
import {
  promptEndTime,
  promptMeetingName,
  promptStartCreate,
  promptStartDate,
} from './views/prompts';

export const startCreate = async (message: CreateSessionMessage): Promise<void> => {
  message.updateSession({
    command: 'new',
    latestPrompt: 'MEETING_NAME',
  });
  await promptStartCreate(message.chat.id);
  await promptMeetingName(message.chat.id);
};

export const onCreateMessage = async (message: CreateSessionMessage): Promise<void> => {
  switch (message.session.latestPrompt) {
    case 'MEETING_NAME':
      await setMeetingName(message);
      return promptStartDate(message.chat.id);
    case 'MEETING_DATE_START':
      return promptStartDate(message.chat.id);
    case 'MEETING_TIME_START':
      await setStartTime(message);
      return promptEndTime(message.chat.id);
    case 'MEETING_TIME_END':
      await setEndTime(message);
      return promptEndTime(message.chat.id);
  }
};

export const setMeetingName = async (message: CreateSessionMessage): Promise<void> => {
  await message.updateSession({
    ...message.session,
    meetingName: message.text,
    latestPrompt: 'MEETING_DATE_START',
  });
};

export const setStartTime = async (message: CreateSessionMessage): Promise<void> => {
  if (message.text === undefined) {
    return;
  }
  const hour = parseHour(message.text);
  if (hour === undefined) {
    return;
  }
  await message.updateSession({
    ...message.session,
    startHour: hour,
    latestPrompt: 'MEETING_TIME_END',
  });
};

export const setEndTime = async (message: CreateSessionMessage): Promise<void> => {
  if (message.text === undefined) {
    return;
  }
  const hour = parseHour(message.text);
  if (hour === undefined) {
    return;
  }
  await message.updateSession({
    ...message.session,
    endHour: hour,
    latestPrompt: 'CONFIRM_OR_ADVANCED',
  });
};
