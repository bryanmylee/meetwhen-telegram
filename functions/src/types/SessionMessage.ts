import { Message } from 'telegram-typings';
import { BindSession } from './BindSession';
import { Session } from './Session';

export interface SessionMessage<T extends Session = Session> extends BindSession<T>, Message {}
