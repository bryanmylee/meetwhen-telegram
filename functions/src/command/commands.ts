import type { BotCommand } from 'telegram-typings';
import type { Command } from './Command';

interface MyBotCommand extends BotCommand {
  command: Command;
}

export const COMMANDS: MyBotCommand[] = [
  {
    command: 'new',
    description: 'Create a new meet',
  },
];
