import { CommandType } from './CommandType';

export interface Session<Prompt = string> {
  command: CommandType;
  latestPrompt: Prompt;
}
