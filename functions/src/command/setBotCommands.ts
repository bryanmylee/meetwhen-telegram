import axios from 'axios';
import { COMMANDS } from './commands';
import { TELEGRAM_API } from '../env';

export const setBotCommands = async (): Promise<void> => {
  await axios.post(TELEGRAM_API + '/setMyCommands', {
    commands: COMMANDS,
  });
};