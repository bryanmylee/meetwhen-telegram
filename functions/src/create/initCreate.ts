import type { BindSession } from '../session/BindSession';
import type { CreateSession } from './CreateSession';
import type { Update } from 'telegram-typings';
import { renderAskForTz, renderSetName, renderStartCreate } from './views/renderCreate';
import { initTz } from '../timezone/initTz';

export const initCreate = async (update: BindSession<Update, CreateSession>): Promise<void> => {
  const { chatId } = update;
  const session = await update.getSession();
  if (session.TZ === undefined) {
    await renderAskForTz(chatId);
    return await initTz(update);
  }
  await update.updateSession({
    COMMAND: 'new',
    LATEST_PROMPT: 'MEETING_NAME',
  });
  await renderStartCreate(chatId);
  await renderSetName(chatId);
};
