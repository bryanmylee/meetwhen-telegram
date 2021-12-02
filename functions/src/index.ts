import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import * as functions from 'firebase-functions';
import type { Message } from 'telegram-typings';
import { handleMessage } from './handle';

export const api = functions.region('asia-east2').https.onRequest(async (req, res) => {
  const message = req.body.message as Message | undefined;
  if (message !== undefined) {
    handleMessage(message);
  }
  res.send();
});
