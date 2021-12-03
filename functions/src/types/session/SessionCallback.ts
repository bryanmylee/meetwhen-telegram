import { CallbackQuery } from 'telegram-typings';
import { BindSession } from './BindSession';
import { Session } from './Session';

export interface SessionCallback<T extends Session = Session>
  extends BindSession<T>,
    CallbackQuery {}
