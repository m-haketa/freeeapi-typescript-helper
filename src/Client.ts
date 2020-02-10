import fs from 'fs';
import path from 'path';

interface Client {
  client_id: string;
  client_secret: string;
}

const clientid_secretpath = 'clientid_secret.json';

export function get(): Client {
  const filename = path.join(__dirname, clientid_secretpath);

  const ret = JSON.parse(fs.readFileSync(filename, 'utf-8')) as Client;
  return ret;
}
