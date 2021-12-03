import { Message } from 'telegram-typings';
import { SessionSubscriber } from './SessionSubscriber';
import { Session } from './Session';

export interface SessionMessage<
  Prompt extends string,
  _Session extends Session<Prompt> = Session<Prompt>
> extends SessionSubscriber<_Session>,
    Message {}
