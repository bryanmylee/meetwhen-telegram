import dayjs from 'dayjs';
import { CreateSession, CREATE_PROMPTS } from '../types/CreateSession';
import { SessionCallback } from '../types/SessionCallback';
import { renderCalendar } from '../views/calendar';

export const onCreateUpdate = async (callback: SessionCallback<CreateSession>): Promise<void> => {
  switch (callback.session.latestPrompt) {
    case 'MEETING_DATE_START':
      return updateStartDate(callback);
  }
};

export const updateStartDate = async (callback: SessionCallback<CreateSession>): Promise<void> => {
  const month = dayjs(callback.session.UI_DATE_PICKER_MONTH);
  const chat_id = callback.message?.chat.id ?? '';
  renderCalendar(month, {
    update_message_id: callback.message?.message_id,
    chat_id,
    text: CREATE_PROMPTS.MEETING_DATE_START,
  });
};
