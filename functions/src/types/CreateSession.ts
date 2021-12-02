import { Session } from './Session';

export const CREATE_PROMPTS = {
  MEETING_NAME: 'Send me the name of your meet\\.',
};

export type CreatePrompt = keyof typeof CREATE_PROMPTS;

export interface CreateSession extends Session<CreatePrompt> {
  meetingName?: string;
}
