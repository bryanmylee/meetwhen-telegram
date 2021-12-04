import type { HourPickerAction } from './HourPickerAction';

export interface HourPickerPayload {
  action: HourPickerAction;
  hourString?: string;
  hour?: number;
}
