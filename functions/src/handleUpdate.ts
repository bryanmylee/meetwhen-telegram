import { inspect } from 'util';
import type { BindSession } from './session/BindSession';
import type { CreateSession } from './create/CreateSession';
import type { Update } from 'telegram-typings';
import { handleCreateUpdate } from './create/handleCreateUpdate';
import { sendMessage } from './utils/sendMessage';
import { initCreate } from './create/initCreate';
import { initTz } from './timezone/initTz';
import { handleTzUpdate } from './timezone/handleTzUpdate';

const INTRO_MESSAGE = `
Welcome to the meetwhen\\.io bot\\!
Get started by setting your timezone with \`/timezone\`\\.
`;

export const handleUpdate = async (update: BindSession<Update>): Promise<void> => {
  // no-op
  const { callback_query } = update.data;
  if (callback_query?.data === 'NOOP') {
    return;
  }
  const session = await update.getSession();
  if (session?.COMMAND === undefined) {
    return await initCommand(update);
  }
  switch (session.COMMAND) {
    case 'timezone':
      return await handleTzUpdate(update);
    case 'new':
      return await handleCreateUpdate(update as unknown as BindSession<Update, CreateSession>);
  }
};

const initCommand = async (update: BindSession<Update>): Promise<void> => {
  const { message } = update.data;
  if (message === undefined) {
    return;
  }
  const { chatId } = update;
  switch (message.text) {
    case '/cancel':
      await update.resetSession();
      await sendMessage({
        chat_id: chatId,
        text: '*Cancelled\\!*',
      });
      return;
    case '/start':
      await update.resetSession();
      await sendMessage({
        chat_id: chatId,
        text: INTRO_MESSAGE,
      });
      return;
    case '/timezone':
      return await initTz(update);
    case '/new':
      return await initCreate(update as unknown as BindSession<Update, CreateSession>);
  }
};

export const handleUpdateWithError = async (update: BindSession<Update>): Promise<void> => {
  try {
    await handleUpdate(update);
  } catch (rawError) {
    const error = rawError as Error;
    console.error('×', inspect(error, { showHidden: false, depth: null, colors: true }));
    sendMessage({
      chat_id: update.chatId,
      text: error.message,
    });
  }
};
