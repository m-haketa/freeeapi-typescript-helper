import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import fs from 'fs';
import path from 'path';

export interface Params {
  redirect_uri: string;
  client_id: string;
  client_secret: string;
  code: string;
}

interface Client {
  client_id: string;
  client_secret: string;
}

export const token_url = 'https://accounts.secure.freee.co.jp/public_api/token';
export const authorize_url =
  'https://accounts.secure.freee.co.jp/public_api/authorize';
export const redirect_uri = '127.0.0.1';
export const redirect_port = 8080;

export function getID_Secret(): Client {
  const filename = path.join(__dirname, 'clientid_secret.json');

  try {
    const ret = JSON.parse(fs.readFileSync(filename, 'utf-8')) as Client;
    return ret;
  } catch (e) {
    throw e;
  }
}

export function getRedirectUri(): string {
  return `http://${redirect_uri}:${redirect_port}/`;
}

const configFileRelativepath = '../src/token.json';

async function getToken(code: string): Promise<Response> {
  const bodyParams = new URLSearchParams();

  const client = getID_Secret();

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveToken(fetchResponseJSON: any): string {
  if (
    'access_token' in fetchResponseJSON &&
    'refresh_token' in fetchResponseJSON
  ) {
    const filename = path.join(__dirname, ...configFileRelativepath.split('/'));
    fs.writeFileSync(filename, JSON.stringify(fetchResponseJSON));

    return filename;
  } else {
    throw '処理が正常に終わりませんでした。' +
      JSON.stringify(fetchResponseJSON);
  }
}

export async function process(code: string): Promise<string> {
  try {
    const fetchResponse = await getToken(code);
    const fetchResponseJSON = await fetchResponse.json();

    return saveToken(fetchResponseJSON);
  } catch (reason) {
    throw reason;
  }
}
