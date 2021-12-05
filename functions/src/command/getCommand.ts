import type { Update } from 'telegram-typings';
import type { CommandType } from './Command';

export interface Command {
  command: CommandType;
  args?: string;
}

export const getCommand = (update: Update): Command => {
  const { message, callback_query } = update;
  const text = message?.text;
  const data = callback_query?.data;
  const tokens =
    (text && text.match(/\/([a-z]+)\s*([\w\s]+)*/)) ??
    (data && data.match(/COMMAND_([a-z]+)\s*([\w\s]+)*/));
  if (tokens == null) {
    throw new Error('Unrecognized command\\.');
  }
  const [, command, args] = tokens;
  return {
    command: command as CommandType,
    args,
  };
};
