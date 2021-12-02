import type { Message } from 'telegram-typings';
import type { CreateSession } from '../../types/CreateSession';

export const handleCreate = async (session: CreateSession, message: Message): Promise<void> => {
  switch (session.latestPrompt) {
    case 'MEETING_NAME':
      console.log('adding new meeting name!');
  }
};
