import type { Update } from 'telegram-typings';

export const getSessionIdFromUpdate = (update: Update): string => {
  const message = update.message;
  const callback = update.callback_query;
  const username = message?.from?.username ?? callback?.from.username ?? '';
  const chatId = message?.chat.id ?? callback?.from.id;
  return `${username}-${chatId}`;
};
