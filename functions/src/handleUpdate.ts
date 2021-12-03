import type { BindSession } from './session/BindSession';
import type { CreateSession } from './create/CreateSession';
import type { Update } from 'telegram-typings';
import { handleCreateUpdate } from './create/handleCreateUpdate';
import { replyToMessage } from './utils/replyToMessage';
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
  const { message } = update.data;
  if (message !== undefined) {
    if (message.text === '/start') {
      await replyToMessage(message, {
        text: 'Welcome to the meetwhen\\.io bot\\! Get started with `/new`\\.',
      });
    }
    if (message.text === '/reset') {
      await update.deleteSession();
      await replyToMessage(message, {
        text: '*Starting over\\!*',
      });
      return;
    }
  }
  const session = await update.getSession();
  if (session?.COMMAND === undefined) {
    return startCommand(update);
  }
  switch (session.COMMAND) {
    case 'new':
      handleCreateUpdate(update as unknown as BindSession<Update, CreateSession>);
  }
};
