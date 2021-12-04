import type { BindSession } from './session/BindSession';
import type { CreateSession } from './create/CreateSession';
import type { Update } from 'telegram-typings';
import { handleCreateUpdate } from './create/handleCreateUpdate';
import { replyToMessage } from './utils/replyToMessage';
import { sendMessage } from './utils/sendMessage';
import { startCreate } from './create/startCreate';

const startCommand = async (update: BindSession<Update>): Promise<void> => {
  const { message } = update.data;
  if (message === undefined) {
    return;
  }
  switch (message.text) {
    case '/new':
      await startCreate(update as unknown as BindSession<Update, CreateSession>);
  }
};

export const handleUpdate = async (update: BindSession<Update>): Promise<void> => {
  // session-less commands
  const { message } = update.data;
  if (message !== undefined) {
    switch (message.text) {
      case '/start':
        await replyToMessage(message, {
          text: 'Welcome to the meetwhen\\.io bot\\! Get started with `/new`\\.',
        });
        return;
      case '/reset':
        await update.deleteSession();
        await replyToMessage(message, {
          text: '*Starting over\\!*',
        });
        return;
    }
  }
  // no-op
  const { callback_query } = update.data;
  if (callback_query?.data === 'NOOP') {
    return;
  }
  const session = await update.getSession();
  if (session?.COMMAND === undefined) {
    return await startCommand(update);
  }
  switch (session.COMMAND) {
    case 'new':
      await handleCreateUpdate(update as unknown as BindSession<Update, CreateSession>);
  }
};

export const handleUpdateWithError = async (update: BindSession<Update>): Promise<void> => {
  const { message, callback_query } = update.data;
  const chatId = message?.chat.id ?? callback_query?.from.id ?? 0;
  try {
    await handleUpdate(update);
  } catch (rawError) {
    const error = rawError as Error;
    console.error('×', error);
    sendMessage({
      chat_id: chatId,
      text: error.message,
    });
  }
};
