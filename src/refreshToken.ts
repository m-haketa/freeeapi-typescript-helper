import * as Authorize from './Authorize';

async function main(): Promise<void> {
  await Authorize.refreshToken().catch(r => {
    throw r;
  });
  console.log('tokenをrefreshしました');
}

main();
