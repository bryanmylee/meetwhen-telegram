import type { CommandType } from '../command/Command';

export interface Session<Prompt = string> {
  COMMAND?: CommandType;
  LATEST_PROMPT?: Prompt;
  TZ?: string | number;
  MESSAGE_ID_TO_EDIT?: number;
}
