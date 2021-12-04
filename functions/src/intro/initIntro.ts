import type { BindSession } from '../session/BindSession';
import type { IntroSession } from './IntroSession';
import type { Update } from 'telegram-typings';
import { renderStartIntro } from './views/renderIntro';

export const initIntro = async (update: BindSession<Update, IntroSession>): Promise<void> => {
  const { chatId } = update;
  await update.setSession({
    COMMAND: 'start',
    LATEST_PROMPT: 'SET_TZ_LOCATION',
  });
  await renderStartIntro(chatId);
};
