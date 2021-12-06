import axios from 'axios';
import type { EditMessageText, Message } from 'telegram-typings';
import { inspect } from 'util';
import { TELEGRAM_API } from '../env';

export const editMessage = async (options: EditMessageText): Promise<Message> => {
	const response = await axios.post(TELEGRAM_API + '/editMessageText', {
		parse_mode: 'MarkdownV2',
		...options,
	});
	console.log('->', inspect(response.data, { showHidden: false, depth: null, colors: true }));
	return response.data as Message;
};
