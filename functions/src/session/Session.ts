import type { Command } from '../command/Command';

export interface Session<Prompt = string> {
  command: Command;
  latestPrompt: Prompt;
}
