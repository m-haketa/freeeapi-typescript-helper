import prompts, { PromptObject } from 'prompts';
import fetch, { RequestInit, Response } from 'node-fetch';
import { URLSearchParams } from 'url';
import fs from 'fs';
import path from 'path';

const tokenUrl = 'https://accounts.secure.freee.co.jp/public_api/token';
const configFileRelativepath = '../src/token.json';

function getDataFromPrompt(): Promise<
  prompts.Answers<'client_id' | 'client_secret' | 'code' | 'redirectUri'>
> {
  const questions: PromptObject<string>[] = [
    {
      type: 'text',
      name: 'client_id',
      message: 'freeeAPIのClient IDを入力してください'
    },
    {
      type: 'text',
      name: 'client_secret',
      message: 'freeeAPIのClient Secretを入力してください'
    },
    {
      type: 'text',
      name: 'redirectUri',
      message: 'freeeAPIのコールバックURLを入力してください'
    },
    {
      type: 'text',
      name: 'code',
      message: 'ブラウザを使って取得した認可コードを入力してください'
    }
  ];

  return prompts(questions, {
    onCancel: () => {
      throw '処理を中断しました';
    }
  });
}

async function getToken(
  client_id: string,
  client_secret: string,
  code: string,
  redirect_uri: string
): Promise<Response> {
  const params = new URLSearchParams();

  params.append('grant_type', 'authorization_code');
  params.append('client_id', client_id);
  params.append('client_secret', client_secret);
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);

  const requestInit: RequestInit = {
    method: 'POST',
    body: params
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

async function main(): Promise<boolean> {
  try {
    const promptResponse = await getDataFromPrompt();

    const fetchResponse = await getToken(
      promptResponse.client_id,
      promptResponse.client_secret,
      promptResponse.code,
      promptResponse.redirectUri
    );

    const fetchResponseJSON = await fetchResponse.json();

    const filenameSaved = saveToken(fetchResponseJSON);
    console.log(`トークンを ${filenameSaved} に保存しました。`);
  } catch (reason) {
    console.log(reason);
    return false;
  }

  return true;
}

main();
