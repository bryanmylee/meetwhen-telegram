import * as functions from 'firebase-functions';

export const BOT_TOKEN = functions.config().env.bot_token as string;
export const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
export const MEETWHEN_API = functions.config().env.meetwhen_api as string;
