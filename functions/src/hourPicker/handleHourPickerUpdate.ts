import type { Update } from 'telegram-typings';
import type { BindSession } from '../session/BindSession';
import { getPayloadFromCallback, getPayloadFromMessage } from './getHourPickerPayload';
import type { HourPickerPayload } from './HourPickerPayload';

export const handleHourPickerUpdate = (update: BindSession<Update>): HourPickerPayload => {
	const { message, callback_query } = update.data;
	if (message === undefined && callback_query === undefined) {
		return { action: 'NOOP' };
	}
	const text = message?.text;
	if (text !== undefined) {
		return getPayloadFromMessage(text);
	}
	const data = callback_query?.data;
	if (data !== undefined) {
		return getPayloadFromCallback(data);
	}
	return { action: 'NOOP' };
};
