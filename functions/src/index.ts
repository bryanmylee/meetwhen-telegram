import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import * as functions from 'firebase-functions';
import type { Message } from 'telegram-typings';
import { injectSession } from './db/sessions';
import { handleMessage } from './handle-message';
import { setCommands } from './set-commands';

setCommands();

export const api = functions.region('asia-east2').https.onRequest(async (req, res) => {
  console.log('<-', req.body);
  const message = req.body.message as Message | undefined;
  if (message !== undefined) {
    handleMessage(await injectSession(message));
  }
  res.send();
});
