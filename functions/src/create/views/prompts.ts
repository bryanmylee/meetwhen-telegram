import dayjs from 'dayjs';
import type { CreateSession } from '../CreateSession';
import type { Dayjs } from 'dayjs';
import type { InlineKeyboardButton, Message } from 'telegram-typings';
import { CREATE_PROMPTS } from '../createPrompts';
import { calendar } from '../../views/calendar';
import { formatHour } from '../../utils/formatHour';
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
  const earliestHour = startHour + 1;
  const latestHour = startHour;
  return sendMessage({
    chat_id,
    text:
      CREATE_PROMPTS.MEETING_HOUR_END +
      `\n\`\\[${formatHour(earliestHour)}-${formatHour(latestHour)}\\]\``,
  });
};

export const promptConfirm = async (chat_id: number, session: CreateSession): Promise<Message> => {
  const inline_keyboard: InlineKeyboardButton[][] = [
    [
      {
        text: session.name ?? '',
        callback_data: 'EDIT_NAME',
      },
    ],
    [
      {
        text: dayjs(session.startDate).format('D MMM YYYY'),
        callback_data: 'EDIT_DATE_START',
      },
      {
        text: dayjs(session.endDate).format('D MMM YYYY'),
        callback_data: 'EDIT_DATE_END',
      },
    ],
    [
      {
        text: formatHour(session.startHour ?? 0),
        callback_data: 'EDIT_HOUR_START',
      },
      {
        text: formatHour(session.endHour ?? 0),
        callback_data: 'EDIT_HOUR_END',
      },
    ],
    [
      {
        text: '✅',
        callback_data: 'SELECT_CONFIRM',
      },
      {
        text: '❌',
        callback_data: 'SELECT_CANCEL',
      },
      {
        text: '⚙',
        callback_data: 'SELECT_MORE',
      },
    ],
  ];
  return sendMessage({
    chat_id,
    text: CREATE_PROMPTS.CONFIRM_OR_ADVANCED,
    reply_markup: {
      inline_keyboard,
    },
  });
};
