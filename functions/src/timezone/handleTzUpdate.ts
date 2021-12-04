import { find } from 'geo-tz';
import type { Update } from 'telegram-typings';
import type { BindSession } from '../session/BindSession';
import { sendMessage } from '../utils/sendMessage';

type TzUpdateHandler = (update: BindSession<Update>, edit?: boolean) => Promise<void>;

export const handleTzUpdate: TzUpdateHandler = async (update) => {
  const session = await update.getSession();
  const { LATEST_PROMPT } = session;
  switch (LATEST_PROMPT) {
    case 'SET_TZ_LOCATION':
      return await handleSetTzByLocation(update);
  }
};

const handleSetTzByLocation: TzUpdateHandler = async (update) => {
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
  await update.resetSession();
};
