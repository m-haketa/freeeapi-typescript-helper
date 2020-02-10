import * as getToken from './getToken';

async function main(): Promise<void> {
  await getToken.refreshTokenFromServer().catch(r => {
    throw r;
  });
  console.log('tokenをrefreshしました');
}

main();
