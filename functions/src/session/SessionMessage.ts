import { Message } from 'telegram-typings';
import { SessionSubscriber } from './SessionSubscriber';
import { Session } from './Session';

export interface SessionMessage<T extends Session = Session>
  extends SessionSubscriber<T>,
    Message {}
