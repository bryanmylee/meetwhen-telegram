import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { CREATE_PROMPTS } from '../createPrompts';
import { calendar } from '../../views/calendar';
import { sendMessage } from '../../utils/sendMessage';

export const promptStartCreate = async (chat_id: number): Promise<void> => {
  await sendMessage({
    chat_id,
    text: '*Creating a new meet\\!*',
  });
};

export const promptMeetingName = async (chat_id: number): Promise<void> => {
  await sendMessage({
    chat_id,
    text: CREATE_PROMPTS.MEETING_NAME,
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

export const promptStartHour = async (chat_id: number): Promise<void> => {
  sendMessage({
    chat_id,
    text: CREATE_PROMPTS.MEETING_HOUR_START + '\n`\\[12am-11pm\\]`',
  });
};

export const promptEndHour = async (chat_id: number): Promise<void> => {
  sendMessage({
    chat_id,
    text: CREATE_PROMPTS.MEETING_HOUR_END + '\n`\\[1am-12am\\]`',
  });
};
