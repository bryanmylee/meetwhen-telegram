import type { Update } from 'telegram-typings';

export interface Identity {
  username: string;
  chatId: number;
}

export const getIdentity = (update: Update): Identity => {
  const message = update.message;
  const callback = update.callback_query;
  const username = message?.from?.username ?? callback?.from.username ?? '';
  const chatId = message?.chat.id ?? callback?.from.id ?? 0;
  return { username, chatId };
};
