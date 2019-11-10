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

const tokenUrl = 'https://accounts.secure.freee.co.jp/public_api/token';
const configFileRelativepath = '../src/token.json';

async function getToken(params: Params): Promise<Response> {
  const bodyParams = new URLSearchParams();

  bodyParams.append('grant_type', 'authorization_code');
  bodyParams.append('client_id', params.client_id);
  bodyParams.append('client_secret', params.client_secret);
  bodyParams.append('code', params.code);
  bodyParams.append('redirect_uri', params.redirect_uri);

  const requestInit: RequestInit = {
    method: 'POST',
    body: bodyParams
  };

  return fetch(tokenUrl, requestInit);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveToken(fetchResponseJSON: any): string {
  if (
    'access_token' in fetchResponseJSON &&
    'refresh_token' in fetchResponseJSON
  ) {
    const token = {
      access_token: fetchResponseJSON.access_token,
      refresh_token: fetchResponseJSON.refresh_token
    };

    const filename = path.join(__dirname, ...configFileRelativepath.split('/'));
    fs.writeFileSync(filename, JSON.stringify(token));

    return filename;
  } else {
    throw '処理が正常に終わりませんでした。' +
      JSON.stringify(fetchResponseJSON);
  }
}

export async function process(params: Params): Promise<string> {
  try {
    const fetchResponse = await getToken(params);
    const fetchResponseJSON = await fetchResponse.json();

    return saveToken(fetchResponseJSON);
  } catch (reason) {
    throw reason;
  }
}
