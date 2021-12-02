import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import * as functions from 'firebase-functions';
import type { CallbackQuery, Message } from 'telegram-typings';
import { bindSession } from './db/sessions';
import { handleCallback } from './handle-callback';
import { handleMessage } from './handle-message';
import { setCommands } from './set-commands';

setCommands();

export const api = functions.region('asia-east2').https.onRequest(async (req, res) => {
  console.log('<-', req.body);
  const message = req.body.message as Message | undefined;
  if (message !== undefined && message) {
    const username = message.from?.username ?? '';
    const chatId = message.chat.id.toString();
    const { session, updateSession } = await bindSession(`${username}-${chatId}`);
    handleMessage({ ...message, session, updateSession });
  }
  const callbackQuery = req.body.callback_query as CallbackQuery | undefined;
  if (callbackQuery !== undefined) {
    const username = callbackQuery.from.username ?? '';
    const chatId = callbackQuery.message?.chat.id ?? '';
    const { session, updateSession } = await bindSession(`${username}-${chatId}`);
    handleCallback({ ...callbackQuery, session, updateSession });
  }
  res.send();
});
