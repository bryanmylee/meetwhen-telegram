import dayjs, { Dayjs } from 'dayjs';
import { CREATE_PROMPTS } from './CreateSession';
import { calendar } from '../views/calendar';
import { reply } from '../utils/reply';
import { send } from '../utils/send';
import { CreateSessionMessage } from './CreateSessionMessage';

export const startCreate = async (message: CreateSessionMessage): Promise<void> => {
  message.updateSession({
    command: 'CREATE_MEET',
    latestPrompt: 'MEETING_NAME',
  });
  await reply(message, {
    text: '*Creating a new meet\\!*',
  });
  promptMeetingName(message.chat.id);
};

export const onCreateMessage = async (message: CreateSessionMessage): Promise<void> => {
  switch (message.session.latestPrompt) {
    case 'MEETING_NAME':
      setMeetingName(message);
      return promptStartDate(message.chat.id);
    case 'MEETING_DATE_START':
      // temp: should be promptEndDate.
      return promptStartDate(message.chat.id);
  }
};

export const promptMeetingName = async (chat_id: number): Promise<void> => {
  await send({
    chat_id,
    text: CREATE_PROMPTS.MEETING_NAME,
  });
};

export const setMeetingName = async (message: CreateSessionMessage): Promise<void> => {
  message.updateSession({
    ...message.session,
    meetingName: message.text,
    latestPrompt: 'MEETING_DATE_START',
  });
};

export const promptStartDate = async (chat_id: number): Promise<void> => {
  const date = dayjs();
  calendar(
    date,
    {
      chat_id,
      text: CREATE_PROMPTS.MEETING_DATE_START,
    },
    {
      earliestDate: dayjs(),
    }
  );
};

export const promptEndDate = async (chat_id: number, startDate: Dayjs): Promise<void> => {
  calendar(
    startDate.add(1, 'day'),
    {
      chat_id,
      text: CREATE_PROMPTS.MEETING_DATE_END,
    },
    {
      earliestDate: startDate.add(1, 'day'),
    }
  );
};
