import * as Token from './Token';

function main(): void {
  Token.refreshTokenFromServer();
  console.log('tokenをrefreshしました');
}

main();
