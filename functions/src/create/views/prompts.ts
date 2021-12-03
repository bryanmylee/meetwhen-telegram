import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { Message } from 'telegram-typings';
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

export const promptStartHour = async (chat_id: number): Promise<Message> => {
  return sendMessage({
    chat_id,
    text: CREATE_PROMPTS.MEETING_HOUR_START + '\n`\\[12am-11pm\\]`',
  });
};

export const promptEndHour = async (chat_id: number, startHour: number): Promise<Message> => {
  const getHourLabel = (hour: number) => {
    if (hour === 0 || hour === 24) {
      return '12am';
    }
    if (hour === 12) {
      return '12pm';
    }
    if (hour > 12) {
      return `${hour - 12}pm`;
    }
    return `${hour}am`;
  };
  const earliestHour = startHour + 1;
  const latestHour = startHour;
  return sendMessage({
    chat_id,
    text:
      CREATE_PROMPTS.MEETING_HOUR_END +
      `\n\`\\[${getHourLabel(earliestHour)}-${getHourLabel(latestHour)}\\]\``,
  });
};
