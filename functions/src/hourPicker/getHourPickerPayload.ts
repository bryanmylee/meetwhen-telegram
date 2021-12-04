import { parseHour } from '../utils/parseHour';
import type { HourPickerPayload } from './HourPickerPayload';

export const getPayloadFromMessage = (text: string): HourPickerPayload => {
  const hour = parseHour(text);
  if (hour === undefined) {
    return { action: 'INVALID', hourString: text };
  }
  return {
    action: 'SELECT',
    hourString: text,
    hour,
  };
};

export const getPayloadFromCallback = (data: string): HourPickerPayload => {
  if (data === undefined) {
    return { action: 'NOOP' };
  }
  const tokens = data.match(/([A-Z]+)_(\w+)/);
  if (tokens === null) {
    return { action: 'INVALID', hourString: data };
  }
  const [, , hourString] = tokens;
  return getPayloadFromMessage(hourString);
};
