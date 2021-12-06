import axios from 'axios';
import { TELEGRAM_API } from '../env';
import { COMMANDS } from './commands';

export const setBotCommands = async (): Promise<void> => {
	await axios.post(TELEGRAM_API + '/setMyCommands', {
		commands: COMMANDS,
	});
};
