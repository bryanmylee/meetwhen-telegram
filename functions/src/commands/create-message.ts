import dayjs from 'dayjs';
import { CreateSession, CREATE_PROMPTS } from '../types/CreateSession';
import { SessionMessage } from '../types/SessionMessage';
import { renderCalendar } from '../views/calendar';
import { reply } from '../utils/reply';

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

export const onCreateMessage = async (message: SessionMessage<CreateSession>): Promise<void> => {
  switch (message.session.latestPrompt) {
    case 'MEETING_NAME':
      setMeetingName(message);
      return promptStartDate(message);
    case 'MEETING_DATE_START':
      // temp: should be promptEndDate.
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
  renderCalendar(month, {
    chat_id: message.chat.id,
    text: CREATE_PROMPTS.MEETING_DATE_START,
  });
};
