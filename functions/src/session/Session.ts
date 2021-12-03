import type { Command } from '../command/Command';

export interface Session<Prompt = string> {
  COMMAND?: Command;
  LATEST_PROMPT: Prompt;
}
