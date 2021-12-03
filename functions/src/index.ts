import * as admin from 'firebase-admin';
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

import * as functions from 'firebase-functions';
import type { Update } from 'telegram-typings';
import { setCommands } from './command/set-commands';
import { getSessionIdFromUpdate } from './session/getSessionIdFromUpdate';
import { BindSession } from './session/BindSession';
import { handleUpdate } from './handleUpdate';

setCommands();

export const api = functions.region('asia-east2').https.onRequest(async (req, res) => {
  console.log('<-', req.body);
  const body = req.body as Update;
  const sessionId = getSessionIdFromUpdate(body);
  const update = new BindSession<Update>(sessionId, body);
  handleUpdate(update);
  res.send();
});
