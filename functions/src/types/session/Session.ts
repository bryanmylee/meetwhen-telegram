import { Command } from '../Command';

export interface Session<Prompt = string> {
  command: Command;
  latestPrompt: Prompt;
}
