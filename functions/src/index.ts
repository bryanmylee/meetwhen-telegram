import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import * as functions from 'firebase-functions';
import type { Update } from 'telegram-typings';
import { BindSession } from './session/BindSession';
import { getIdentity } from './session/getIdentity';
import { handleUpdateWithError } from './handleUpdate';
import { inspect } from 'util';
import { setBotCommands } from './command/setBotCommands';

setBotCommands();

export const api = functions.region('asia-east2').https.onRequest(async (req, res) => {
  console.log('<-', inspect(req.body, { showHidden: false, depth: null, colors: true }));
  const body = req.body as Update;
  const { chatId, username } = getIdentity(body);
  const update = new BindSession<Update>(chatId, username, body);
  await handleUpdateWithError(update);
  res.send();
});
