import type { Message } from 'telegram-typings';
import type { Session } from './Session';
import type { SessionSubscriber } from './SessionSubscriber';

export interface SessionMessage<
  Prompt extends string,
  _Session extends Session<Prompt> = Session<Prompt>
> extends SessionSubscriber<_Session>,
    Message {}
