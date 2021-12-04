import axios from 'axios';
import { MEETWHEN_API } from '../../env';

interface QueryParams {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const query = async ({ query, variables, headers }: QueryParams): Promise<unknown> => {
  const response = await axios.post(
    MEETWHEN_API,
    {
      query: query.replace(/(\s|\n)+/g, ' '),
      variables,
    },
    { withCredentials: true, headers }
  );
  const { data, errors } = response.data;
  if (errors !== undefined) {
    throw errors;
  }
  return data;
};
