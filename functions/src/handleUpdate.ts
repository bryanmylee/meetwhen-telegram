import { inspect } from 'util';
import type { BindSession } from './session/BindSession';
import type { CreateSession } from './create/CreateSession';
import type { Update } from 'telegram-typings';
import { handleCreateUpdate } from './create/handleCreateUpdate';
import { sendMessage } from './utils/sendMessage';
import { initCreate } from './create/initCreate';
import { initIntro } from './intro/initIntro';
import type { IntroSession } from './intro/IntroSession';
import { handleIntroUpdate } from './intro/handleIntroUpdate';

const initCommand = async (update: BindSession<Update>): Promise<void> => {
  const { message } = update.data;
  if (message === undefined) {
    return;
  }
  switch (message.text) {
    case '/start':
      return await initIntro(update as unknown as BindSession<Update, IntroSession>);
    case '/new':
      return await initCreate(update as unknown as BindSession<Update, CreateSession>);
  }
};

export const handleUpdate = async (update: BindSession<Update>): Promise<void> => {
  // no-op
  const { callback_query } = update.data;
  if (callback_query?.data === 'NOOP') {
    return;
  }
  if (update.data.message?.text === '/cancel') {
    await update.deleteSession();
    await sendMessage({
      chat_id: update.chatId,
      text: '*Cancelled\\!*',
    });
    return;
  }

  const session = await update.getSession();
  if (session?.COMMAND === undefined) {
    return await initCommand(update);
  }
  switch (session.COMMAND) {
    case 'start':
      return await handleIntroUpdate(update as unknown as BindSession<Update, IntroSession>);
    case 'new':
      return await handleCreateUpdate(update as unknown as BindSession<Update, CreateSession>);
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
