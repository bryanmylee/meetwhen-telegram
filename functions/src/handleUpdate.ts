import type { BindSession } from './session/BindSession';
import type { CreateSession } from './create/CreateSession';
import type { Update } from 'telegram-typings';
import { handleCreateUpdate } from './create/handleCreateUpdate';
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
  const session = await update.getSession();
  if (session?.command === undefined) {
    return startCommand(update);
  }
  switch (session.command) {
    case 'new':
      handleCreateUpdate(update as unknown as BindSession<Update, CreateSession>);
  }
};
