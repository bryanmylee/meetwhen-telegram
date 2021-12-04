import { find } from 'geo-tz';
import type { Update } from 'telegram-typings';
import type { BindSession } from '../session/BindSession';
import { sendMessage } from '../utils/sendMessage';
import type { IntroSession } from './IntroSession';

type IntroUpdateHandler = (
  update: BindSession<Update, IntroSession>,
  edit?: boolean
) => Promise<void>;

export const handleIntroUpdate: IntroUpdateHandler = async (update) => {
  const session = await update.getSession();
  const { LATEST_PROMPT } = session;
  switch (LATEST_PROMPT) {
    case 'SET_TZ_LOCATION':
      return await handleSetTzByLocation(update);
  }
};

const handleSetTzByLocation: IntroUpdateHandler = async (update) => {
  const location = update.data.message?.location;
  if (location === undefined) {
    // TODO render manual select.
    return await update.setSession({
      LATEST_PROMPT: 'SET_TZ_MANUAL',
    });
  }
  const timezone = find(location.latitude, location.longitude)[0];
  await update.updateSession({
    TZ: timezone,
  });
  await sendMessage({
    chat_id: update.chatId,
    text: `Your timezone has been set to \`${timezone}\`\\.`,
  });
};
