import type { Update } from 'telegram-typings';
import type { BindSession } from '../session/BindSession';
import { sendMessage } from '../utils/sendMessage';
import { renderAskForLocation } from './views/renderTz';

export const initTz = async (update: BindSession<Update>): Promise<void> => {
	const { chatId } = update;
	await sendMessage({
		chat_id: chatId,
		text: '*Setting timezone\\.*',
	});
	await renderAskForLocation(chatId);
	await update.updateSession({
		COMMAND: 'timezone',
		LATEST_PROMPT: 'SET_TZ_LOCATION',
	});
};
