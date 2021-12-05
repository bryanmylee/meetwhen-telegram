import type { BotCommand } from 'telegram-typings';
import type { CommandType } from './Command';

interface MyBotCommand extends BotCommand {
  command: CommandType;
}

export const COMMANDS: MyBotCommand[] = [
  {
    command: 'timezone',
    description: 'Set your current timezone',
  },
  {
    command: 'new',
    description: 'Create a new meet',
  },
  {
    command: 'cancel',
    description: 'Cancel your current action',
  },
];
