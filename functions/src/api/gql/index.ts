import { MEETWHEN_API } from '../../env';
import fetch from 'node-fetch';

interface QueryParams {
  query: string;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const query = async ({ query, variables, headers }: QueryParams): Promise<unknown> => {
  const response = await fetch(MEETWHEN_API, {
    method: 'post',
    headers: {
      ...headers,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({ query: query.replace(/(\s|\n)+/g, ' '), variables }),
  });
  const { data, errors } = await response.json();
  if (errors !== undefined) {
    throw errors;
  }
  return data;
};
