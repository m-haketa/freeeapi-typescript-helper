import fs from 'fs';
import path from 'path';

interface State {
  state: string;
  timestamp: number;
}

const statepath = 'statedata.json';
const state_expires_in = 600;

function getUnixTime(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

function createStateString(): string {
  const state_string_length = 16;

  // 生成する文字列に含める文字セット
  const char = 'abcdefghijklmnopqrstuvwxyz0123456789';

  const char_length = char.length;
  let state_str = '';
  for (let i = 0; i < state_string_length; i++) {
    state_str += char[Math.floor(Math.random() * char_length)];
  }

  return state_str;
}

export function createState(): string {
  const state: State = {
    state: createStateString(),
    timestamp: getUnixTime(new Date())
  };

  const filename = path.join(__dirname, statepath);
  fs.writeFileSync(filename, JSON.stringify(state));

  return state.state;
}

export function checkState(stateFromServer: string): boolean {
  const filename = path.join(__dirname, statepath);

  const state = JSON.parse(fs.readFileSync(filename, 'utf-8')) as State;
  fs.unlinkSync(filename);

  if (state.timestamp + state_expires_in <= getUnixTime(new Date())) {
    throw new Error('state expired');
  }

  if (state.state !== stateFromServer) {
    throw new Error('invalid state');
  }

  return true;
}
