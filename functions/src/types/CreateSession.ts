import { Session } from './Session';

export const CREATE_PROMPTS = {
  MEETING_NAME: 'Give your meet a name:',
};

export type CreatePrompt = keyof typeof CREATE_PROMPTS;

export interface CreateSession extends Session<CreatePrompt> {
  meetingName?: string;
}
