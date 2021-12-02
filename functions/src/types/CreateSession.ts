import { Session } from './Session';

export const CREATE_PROMPTS = {
  MEETING_NAME: 'Send me the name of your meet\\.',
  MEETING_DATE_START: 'What day should we start?',
  MEETING_DATE_END: 'What day should we end?',
  MEETING_TIME_START: 'What time should we start?',
  MEETING_TIME_END: 'What time should we end?',
  CONFIRM_OR_ADVANCED: 'Confirm your meet or set more advanced options\\.',
};

export type CreatePrompt = keyof typeof CREATE_PROMPTS;

export interface CreateSession extends Session<CreatePrompt> {
  meetingName?: string;
}
