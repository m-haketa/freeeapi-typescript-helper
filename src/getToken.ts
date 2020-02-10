import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import querystring from 'querystring';

import * as State from './State';
import * as Token from './Token';
import * as Client from './Client';

const token_url = 'https://accounts.secure.freee.co.jp/public_api/token';
const authorize_url =
  'https://accounts.secure.freee.co.jp/public_api/authorize';

export const redirect_uri = '127.0.0.1';
export const redirect_port = 8080;

function getRedirectUri(): string {
  return `http://${redirect_uri}:${redirect_port}/`;
}

async function fetchToGetToken(code: string): Promise<Response> {
  const bodyParams = new URLSearchParams();

  const client = Client.get();

  bodyParams.append('grant_type', 'authorization_code');
  bodyParams.append('client_id', client.client_id);
  bodyParams.append('client_secret', client.client_secret);
  bodyParams.append('code', code);
  bodyParams.append('redirect_uri', getRedirectUri());

  const requestInit: RequestInit = {
    method: 'POST',
    body: bodyParams
  };

  return fetch(token_url, requestInit);
}

async function fetchToRefreshToken(): Promise<Response> {
  const bodyParams = new URLSearchParams();

  const refresh_token = Token.get().refresh_token;
  const client = Client.get();

  bodyParams.append('grant_type', 'refresh_token');
  bodyParams.append('client_id', client.client_id);
  bodyParams.append('client_secret', client.client_secret);
  bodyParams.append('refresh_token', refresh_token);

  const requestInit: RequestInit = {
    method: 'POST',
    body: bodyParams
  };

  return fetch(token_url, requestInit);
}

export function getTokenFromServerUrl(): string {
  const client = Client.get();

  return (
    authorize_url +
    '?' +
    querystring.stringify({
      client_id: client.client_id,
      redirect_uri: getRedirectUri(),
      response_type: 'code',
      state: State.create()
    })
  );
}

export async function getTokenFromServer(code: string): Promise<string> {
  const fetchResponse = await fetchToGetToken(code).catch(r => {
    throw r;
  });
  const fetchResponseJSON = await fetchResponse.json().catch(r => {
    throw r;
  });

  return Token.set(fetchResponseJSON);
}

export async function refreshTokenFromServer(): Promise<string> {
  const fetchResponse = await fetchToRefreshToken().catch(r => {
    throw r;
  });

  const fetchResponseJSON = await fetchResponse.json().catch(r => {
    throw r;
  });

  return Token.set(fetchResponseJSON);
}
