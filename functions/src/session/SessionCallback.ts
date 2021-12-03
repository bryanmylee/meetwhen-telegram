import { CallbackQuery } from 'telegram-typings';
import { SessionSubscriber } from './SessionSubscriber';
import { Session } from './Session';

export interface SessionCallback<T extends Session = Session>
  extends SessionSubscriber<T>,
    CallbackQuery {}
