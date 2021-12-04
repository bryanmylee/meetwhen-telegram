import type { BindSession } from '../session/BindSession';
import type { CreateSession } from './CreateSession';
import type { Update } from 'telegram-typings';
import { renderSetName, renderStartCreate } from './views/renderCreate';

export const initCreate = async (update: BindSession<Update, CreateSession>): Promise<void> => {
  const { chatId } = update;
  await update.setSession({
    COMMAND: 'new',
    LATEST_PROMPT: 'MEETING_NAME',
  });
  await renderStartCreate(chatId);
  await renderSetName(chatId);
};
