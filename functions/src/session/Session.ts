import type { Command } from '../command/Command';

export interface Session<Prompt = string> {
  COMMAND?: Command;
  LATEST_PROMPT: Prompt;
  TZ?: string;
  MESSAGE_ID_TO_EDIT?: number;
}
