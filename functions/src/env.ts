import * as functions from 'firebase-functions';

export const telegramToken = functions.config().env.telegram_token as string;
export const TELEGRAM_API = `https://api.telegram.org/bot${telegramToken}`;
