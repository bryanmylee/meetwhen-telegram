import axios from 'axios';
import { TELEGRAM_API } from './env';

export const setCommands = async (): Promise<void> => {
  await axios.post(TELEGRAM_API + '/setMyCommands', {
    commands: [
      {
        command: 'new',
        description: 'Create a new meet',
      },
    ],
  });
};
