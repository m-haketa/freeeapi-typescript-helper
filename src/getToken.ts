import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import fs from 'fs';
import path from 'path';
import querystring from 'querystring';

import * as State from './State';

interface Client {
  client_id: string;
  client_secret: string;
}

interface Token {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
  createdat: number;
}

const tokenpath = 'token.json';
const clientid_secretpath = 'clientid_secret.json';

const token_url = 'https://accounts.secure.freee.co.jp/public_api/token';
const authorize_url =
  'https://accounts.secure.freee.co.jp/public_api/authorize';

export const redirect_uri = '127.0.0.1';
export const redirect_port = 8080;

export function getToken(): Token {
  const filename = path.join(__dirname, tokenpath);

  return JSON.parse(fs.readFileSync(filename, 'utf-8')) as Token;
}

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

  const refresh_token = getToken().refresh_token;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveTokenToFile(fetchResponseJSON: any): string {
  if (
    'access_token' in fetchResponseJSON &&
    'refresh_token' in fetchResponseJSON
  ) {
    const filename = path.join(__dirname, tokenpath);
    fs.writeFileSync(filename, JSON.stringify(fetchResponseJSON));

    return filename;
  } else {
    throw '処理が正常に終わりませんでした。' +
      JSON.stringify(fetchResponseJSON);
  }
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
      state: State.createState()
    })
  );
}

export async function getTokenFromServer(code: string): Promise<string> {
  const fetchResponse = await fetchToGetToken(code);
  const fetchResponseJSON = await fetchResponse.json();

  return saveTokenToFile(fetchResponseJSON);
}

export async function refreshTokenFromServer(): Promise<string> {
  try {
    const fetchResponse = await fetchToRefreshToken();
    const fetchResponseJSON = await fetchResponse.json();

    return saveTokenToFile(fetchResponseJSON);
  } catch (reason) {
    throw reason;
  }
}
