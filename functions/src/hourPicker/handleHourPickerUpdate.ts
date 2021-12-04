import type { Update } from 'telegram-typings';
import type { BindSession } from '../session/BindSession';
import type { HourPickerPayload } from './HourPickerPayload';
import { getPayloadFromMessage, getPayloadFromCallback } from './getHourPickerPayload';

export const handleHourPickerUpdate = (update: BindSession<Update>): HourPickerPayload => {
  const { message, callback_query } = update.data;
  if (message === undefined && callback_query === undefined) {
    return { action: 'NOOP' };
  }
  const text = message?.text;
  if (text !== undefined) {
    console.log('text payload', text);
    return getPayloadFromMessage(text);
  }
  const data = callback_query?.data;
  if (data !== undefined) {
    console.log('data payload', data);
    return getPayloadFromCallback(data);
  }
  return { action: 'NOOP' };
};
