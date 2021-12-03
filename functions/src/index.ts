import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import * as functions from 'firebase-functions';
import type { CallbackQuery, Message } from 'telegram-typings';
import { handleCallback } from './handle-callback';
import { handleMessage } from './handle-message';
import { liveSession } from './session/SessionSubscriber';
import { setCommands } from './command/set-commands';

setCommands();

export const api = functions.region('asia-east2').https.onRequest(async (req, res) => {
  console.log('<-', req.body);
  const message = req.body.message as Message | undefined;
  const callback = req.body.callback_query as CallbackQuery | undefined;
  const username = message?.from?.username ?? callback?.from.username ?? '';
  const chatId = message?.chat.id ?? callback?.from.id;
  const sessionId = `${username}-${chatId}`;
  const [{ session, updateSession }, unsubscribe] = await liveSession(sessionId);
  if (message !== undefined) {
    handleMessage({ ...message, session, updateSession });
  }
  if (callback !== undefined && callback.data !== undefined && callback.data !== 'NOOP') {
    handleCallback({ ...callback, session, updateSession });
  }
  unsubscribe();
  res.send();
});
