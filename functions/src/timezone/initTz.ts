import type { BindSession } from '../session/BindSession';
import type { Update } from 'telegram-typings';
import { renderAskForLocation } from './views/renderTz';

export const initTz = async (update: BindSession<Update>): Promise<void> => {
  const { chatId } = update;
  await renderAskForLocation(chatId);
  await update.updateSession({
    COMMAND: 'timezone',
    LATEST_PROMPT: 'SET_TZ_LOCATION',
  });
};
