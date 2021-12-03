import { Command } from '../commands/Command';

export interface Session<Prompt = string> {
  command: Command;
  latestPrompt: Prompt;
}
