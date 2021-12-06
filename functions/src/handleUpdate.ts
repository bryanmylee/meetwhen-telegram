import type { Update } from 'telegram-typings';
import { inspect } from 'util';
import { getCommand } from './command/getCommand';
import type { CreateSession } from './create/CreateSession';
import { handleCreateUpdate } from './create/handleCreateUpdate';
import { initCreate } from './create/initCreate';
import type { BindSession } from './session/BindSession';
import { handleTzUpdate } from './timezone/handleTzUpdate';
import { initTz } from './timezone/initTz';
import { sendMessage } from './utils/sendMessage';

const INTRO_MESSAGE = `
Welcome to the meetwhen\\.io bot\\!
Get started by setting your timezone\\.
`;

export const handleUpdate = async (update: BindSession<Update>): Promise<void> => {
	// no-op
	const { callback_query } = update.data;
	if (callback_query?.data === 'NOOP') {
		return;
	}
	if (update.data.message?.text === '/cancel') {
		await update.resetSession();
		await sendMessage({
			chat_id: update.chatId,
			text: '*Cancelled\\!*',
		});
		return;
	}
	const session = await update.getSession();
	if (session?.COMMAND === undefined) {
		return await initCommand(update);
	}
	switch (session.COMMAND) {
		case 'timezone':
			return await handleTzUpdate(update);
		case 'new':
			return await handleCreateUpdate(update as unknown as BindSession<Update, CreateSession>);
	}
};

const initCommand = async (update: BindSession<Update>): Promise<void> => {
	const { chatId, data } = update;
	const { command } = getCommand(data);
	switch (command) {
		case 'start':
			await update.resetSession();
			await sendMessage({
				chat_id: chatId,
				text: INTRO_MESSAGE,
				reply_markup: {
					inline_keyboard: [[{ text: 'Set timezone 🕙', callback_data: 'COMMAND_timezone' }]],
				},
			});
			return;
		case 'timezone':
			return await initTz(update);
		case 'new':
			return await initCreate(update as unknown as BindSession<Update, CreateSession>);
	}
};

export const handleUpdateWithError = async (update: BindSession<Update>): Promise<void> => {
	try {
		await handleUpdate(update);
	} catch (rawError) {
		const error = rawError as Error;
		console.error('×', inspect(error, { showHidden: false, depth: null, colors: true }));
		sendMessage({
			chat_id: update.chatId,
			text: error.message,
		});
	}
};
