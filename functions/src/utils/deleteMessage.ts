import axios from 'axios';
import type { DeleteMessage } from 'telegram-typings';
import { inspect } from 'util';
import { TELEGRAM_API } from '../env';

export const deleteMessage = async (options: DeleteMessage): Promise<boolean> => {
	try {
		const response = await axios.post(TELEGRAM_API + '/deleteMessage', options);
		console.log('->', inspect(response.data, { showHidden: false, depth: null, colors: true }));
		return true;
	} catch (error) {
		return false;
	}
};
