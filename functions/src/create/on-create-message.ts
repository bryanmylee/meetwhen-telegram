import type { CreateSessionMessage } from './CreateSessionMessage';
import { promptMeetingName, promptStartCreate, promptStartDate } from './views/prompts';

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
  }
};

export const setMeetingName = async (message: CreateSessionMessage): Promise<void> => {
  await message.updateSession({
    ...message.session,
    meetingName: message.text,
    latestPrompt: 'MEETING_DATE_START',
  });
};
