import { find } from 'geo-tz';
import type { Update } from 'telegram-typings';
import type { BindSession } from '../session/BindSession';
import { getTzLabel } from './getTzLabel';
import { parseUtcOffset } from './parseUtcOffset';
import { renderAskForManualTz, renderDone } from './views/renderTz';

type TzUpdateHandler = (update: BindSession<Update>, edit?: boolean) => Promise<void>;

export const handleTzUpdate: TzUpdateHandler = async (update) => {
	const session = await update.getSession();
	const { LATEST_PROMPT } = session;
	switch (LATEST_PROMPT) {
		case 'SET_TZ_LOCATION':
			return await handleSetTzByLocation(update);
		case 'SET_TZ_MANUAL':
			return await handleSetTzManually(update);
	}
};

const handleSetTzByLocation: TzUpdateHandler = async (update) => {
	const { chatId } = update;
	const location = update.data.message?.location;
	if (location === undefined) {
		renderAskForManualTz(chatId);
		return await update.updateSession({
			LATEST_PROMPT: 'SET_TZ_MANUAL',
		});
	}
	const timezone = find(location.latitude, location.longitude)[0];
	await update.updateSession({
		TZ: timezone,
	});
	await renderDone(chatId, timezone);
	await update.resetSession();
};

const handleSetTzManually: TzUpdateHandler = async (update) => {
	const { chatId } = update;
	const text = update.data.message?.text;
	if (text === undefined) {
		return;
	}
	const offset = parseUtcOffset(text);
	if (offset === undefined) {
		throw new Error(`I don't understand ${text}\\. Try again?`);
	}
	await update.updateSession({
		TZ: offset,
	});
	await renderDone(chatId, getTzLabel(offset));
	await update.resetSession();
};
