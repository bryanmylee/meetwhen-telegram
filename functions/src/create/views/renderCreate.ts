import dayjs from 'dayjs';
import type { ConfirmAction } from '../ConfirmAction';
import type { CreateSession } from '../CreateSession';
import type { Dayjs } from 'dayjs';
import type { InlineKeyboardButton, Message } from 'telegram-typings';
import { CREATE_PROMPTS } from '../createPrompts';
import { formatHour } from '../../utils/formatHour';
import { renderCalendar } from '../../calendar/views/renderCalendar';
import { sendMessage } from '../../utils/sendMessage';
import type { Meeting } from '../../api/types';

export const renderStartCreate = async (chat_id: number): Promise<Message> => {
  return await sendMessage({
    chat_id,
    text: '*Creating a new meet\\!*',
  });
};

export const renderSetName = async (chat_id: number): Promise<Message> => {
  return await sendMessage({
    chat_id,
    text: CREATE_PROMPTS.MEETING_NAME,
  });
};

export const renderSetStartDate = async (chat_id: number): Promise<Message> => {
  const date = dayjs();
  return await renderCalendar(
    date,
    {
      chat_id,
      text: CREATE_PROMPTS.MEETING_DATE_START,
    },
    { earliestDate: dayjs() }
  );
};

export const renderSetEndDate = async (chat_id: number, startDate: Dayjs): Promise<Message> => {
  return await renderCalendar(
    startDate,
    {
      chat_id,
      text: CREATE_PROMPTS.MEETING_DATE_END,
    },
    { earliestDate: startDate }
  );
};

export const renderSetStartHour = async (chat_id: number): Promise<Message> => {
  return await sendMessage({
    chat_id,
    text: CREATE_PROMPTS.MEETING_HOUR_START + '\n`\\[12am-11pm\\]`',
  });
};

export const renderSetEndHour = async (chat_id: number, startHour: number): Promise<Message> => {
  const earliestHour = startHour + 1;
  const latestHour = startHour;
  return await sendMessage({
    chat_id,
    text:
      CREATE_PROMPTS.MEETING_HOUR_END +
      `\n\`\\[${formatHour(earliestHour)}-${formatHour(latestHour)}\\]\``,
  });
};

export const renderConfirm = async (chat_id: number, session: CreateSession): Promise<Message> => {
  interface ConfirmInlineButton extends InlineKeyboardButton {
    callback_data: ConfirmAction;
  }
  const inline_keyboard: ConfirmInlineButton[][] = [
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
    ],
  ];
  return await sendMessage({
    chat_id,
    text: CREATE_PROMPTS.CONFIRM_OR_EDIT,
    reply_markup: { inline_keyboard },
  });
};

export const renderDone = async (chat_id: number, meeting: Meeting): Promise<Message> => {
  const inline_keyboard: InlineKeyboardButton[][] = [
    [
      {
        text: '',
        url: `https://meetwhen.io/${meeting.slug}`,
      },
    ],
  ];
  return await sendMessage({
    chat_id,
    text: `All done\\! Visit your meet [here](https://meetwhen.io/${meeting.slug})\\.`,
    reply_markup: { inline_keyboard },
  });
};

export const renderCancel = async (chat_id: number): Promise<Message> => {
  return await sendMessage({
    chat_id,
    text: 'Cancelled\\.',
  });
};
