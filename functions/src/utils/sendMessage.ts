import axios from 'axios';
import type { Message, SendMessage } from 'telegram-typings';
import { inspect } from 'util';
import { TELEGRAM_API } from '../env';

export const sendMessage = async (options: SendMessage): Promise<Message> => {
	const response = await axios.post(TELEGRAM_API + '/sendMessage', {
		parse_mode: 'MarkdownV2',
		...options,
	});
	console.log('->', inspect(response.data, { showHidden: false, depth: null, colors: true }));
	return response.data.result as Message;
};
