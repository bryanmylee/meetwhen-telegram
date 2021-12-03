import { CallbackQuery } from 'telegram-typings';
import { SessionSubscriber } from './SessionSubscriber';
import { Session } from './Session';

export interface SessionCallback<
  Prompt extends string,
  _Session extends Session<Prompt> = Session<Prompt>
> extends SessionSubscriber<_Session>,
    CallbackQuery {}
