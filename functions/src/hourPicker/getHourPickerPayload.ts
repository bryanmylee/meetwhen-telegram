import { parseHour } from '../utils/parseHour';
import type { HourPickerAction } from './HourPickerAction';
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
  const [, action, hourString] = tokens;
  const hour = parseHour(hourString);
  if (hour === undefined) {
    return { action: 'INVALID', hourString };
  }
  return { action: action as HourPickerAction, hourString, hour };
};
