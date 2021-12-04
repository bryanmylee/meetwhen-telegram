import axios from 'axios';
import type { DeleteMessage } from 'telegram-typings';
import { TELEGRAM_API } from '../env';

export const deleteMessage = async (options: DeleteMessage): Promise<boolean> => {
  try {
    const response = await axios.post(TELEGRAM_API + '/deleteMessage', options);
    console.log('->', response.data);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
