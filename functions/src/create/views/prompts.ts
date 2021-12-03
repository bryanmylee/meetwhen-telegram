import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { CREATE_PROMPTS } from '../createPrompts';
import { calendar } from '../../views/calendar';
import { send } from '../../utils/send';

export const promptStartCreate = async (chat_id: number): Promise<void> => {
  await send({
    chat_id,
    text: '*Creating a new meet\\!*',
  });
};

export const promptMeetingName = async (chat_id: number): Promise<void> => {
  await send({
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

export const promptStartTime = async (chat_id: number): Promise<void> => {
  send({
    chat_id,
    text: CREATE_PROMPTS.MEETING_TIME_START,
  });
};
