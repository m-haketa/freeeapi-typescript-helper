import fs from 'fs';
import path from 'path';

interface Token {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

const tokenpath = 'tokendata.json';

export function get(): Token {
  const filename = path.join(__dirname, tokenpath);

  return JSON.parse(fs.readFileSync(filename, 'utf-8')) as Token;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function set(tokendata: Token): string {
  if ('access_token' in tokendata && 'refresh_token' in tokendata) {
    const filename = path.join(__dirname, tokenpath);
    fs.writeFileSync(filename, JSON.stringify(tokendata));

    return filename;
  } else {
    throw new Error(JSON.stringify(tokendata));
  }
}
