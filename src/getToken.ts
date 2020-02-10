import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

import * as State from './State';
import * as token from './Token';

interface Client {
  client_id: string;
  client_secret: string;
}

const clientid_secretpath = 'clientid_secret.json';

const token_url = 'https://accounts.secure.freee.co.jp/public_api/token';
const authorize_url =
  'https://accounts.secure.freee.co.jp/public_api/authorize';

export const redirect_uri = '127.0.0.1';
export const redirect_port = 8080;

function getRedirectUri(): string {
  return `http://${redirect_uri}:${redirect_port}/`;
}

function getClient(): Client {
  const filename = path.join(__dirname, clientid_secretpath);

  const ret = JSON.parse(fs.readFileSync(filename, 'utf-8')) as Client;
  return ret;
}

async function fetchToGetToken(code: string): Promise<Response> {
  const bodyParams = new URLSearchParams();

  const client = getClient();

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

  const refresh_token = token.get().refresh_token;
  const client = getClient();

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
  const client = getClient();

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

  return token.set(fetchResponseJSON);
}

export async function refreshTokenFromServer(): Promise<string> {
  const fetchResponse = await fetchToRefreshToken().catch(r => {
    throw r;
  });

  const fetchResponseJSON = await fetchResponse.json().catch(r => {
    throw r;
  });

  return token.set(fetchResponseJSON);
}
