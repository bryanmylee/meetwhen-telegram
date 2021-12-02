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
  if (message !== undefined) {
    const username = message.from?.username ?? '';
    const chatId = message.chat.id.toString();
    const { session, updateSession } = await bindSession(`${username}-${chatId}`);
    handleMessage({ ...message, session, updateSession });
  }
  const callback = req.body.callback_query as CallbackQuery | undefined;
  if (callback !== undefined && callback.data !== undefined && callback.data !== 'NOOP') {
    const username = callback.from.username ?? '';
    const chatId = callback.from.id;
    const { session, updateSession } = await bindSession(`${username}-${chatId}`);
    handleCallback({ ...callback, session, updateSession });
  }
  res.send();
});
