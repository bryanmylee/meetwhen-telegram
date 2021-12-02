import type { Message } from 'telegram-typings';
import { CreateSession, CREATE_PROMPTS } from '../../types/CreateSession';
import { reply } from '../../utils/reply';
import { updateSessionWithId } from '../../db/sessions';

export const handleCreate = async (session: CreateSession, message: Message): Promise<void> => {
  switch (session.latestPrompt) {
    case 'MEETING_NAME':
      return handleMeetingName(session, message);
  }
};

const handleMeetingName = async (session: CreateSession, message: Message): Promise<void> => {
  const newSession: CreateSession = {
    ...session,
    meetingName: message.text,
    latestPrompt: 'MEETING_DATE_START',
  };
  updateSessionWithId(message.chat.id.toString(), newSession);
  reply(message, {
    text: CREATE_PROMPTS.MEETING_DATE_START,
  });
};
