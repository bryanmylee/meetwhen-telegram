import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import * as functions from 'firebase-functions';
import type { Update } from 'telegram-typings';
import { setBotCommands } from './command/setBotCommands';
import { getIdentity } from './session/getIdentity';
import { BindSession } from './session/BindSession';
import { handleUpdateWithError } from './handleUpdate';

setBotCommands();

export const api = functions.region('asia-east2').https.onRequest(async (req, res) => {
  console.log('<-', req.body);
  const body = req.body as Update;
  const { chatId, username } = getIdentity(body);
  const update = new BindSession<Update>(chatId, username, body);
  await handleUpdateWithError(update);
  res.send();
});
