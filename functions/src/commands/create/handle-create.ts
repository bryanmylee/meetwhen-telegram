import dayjs from 'dayjs';
import type { Message } from 'telegram-typings';
import { CreateSession, CREATE_PROMPTS } from '../../types/CreateSession';
import { reply } from '../../utils/reply';
import { updateSessionWithId } from '../../db/sessions';
import { range } from '../../utils/range';

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
};

const promptStartDate = async (session: CreateSession, message: Message): Promise<void> => {
  const month = dayjs(session.UI_DATE_PICKER_MONTH ?? dayjs().format('YYYYMMDD'));
  const dates = range(month.daysInMonth());
  reply(message, {
    text: CREATE_PROMPTS.MEETING_DATE_START,
    reply_markup: {
      keyboard: [],
    },
  });
};
