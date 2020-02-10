import * as getToken from './getToken';

function main(): void {
  getToken.refreshTokenFromServer();
  console.log('tokenをrefreshしました');
}

main();
