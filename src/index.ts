import * as Api from './freeeapi/api';
import fs from 'fs';
import path from 'path';

const configFilename = 'token.json';

async function sample(accessToken: string): Promise<boolean> {
  //会社一覧取得
  try {
    const companyApi = new Api.CompaniesApi();
    companyApi.accessToken = accessToken;

    const companyRoot = await companyApi.getCompanies();
    console.log('---会社一覧---');
    console.log(companyRoot.body.companies);

    //１つ目の会社のIDを取得
    const companyId = companyRoot.body.companies[0].id;

    //試算表BS取得
    const trialBsApi = new Api.TrialBalanceApi();
    trialBsApi.accessToken = accessToken;

    const trialBsRoot = await trialBsApi.getTrialBs(companyId);
    console.log('---試算表(BS)---');
    console.log(trialBsRoot.body.trialBs);
  } catch (reason) {
    console.log(reason);
    return false;
  }
  return true;
}

function main(): void {
  const filepath = path.join(__dirname, configFilename);

  let tokensJson = '';
  try {
    tokensJson = fs.readFileSync(filepath, 'utf-8');
  } catch (reason) {
    console.log('トークンの情報（token.json）が取得できませんでした。');
    console.log('「npm run start:gettoken」で、新しくトークンを取得するか、');
    console.log(
      'srcフォルダにある「token_example.json」のファイル名を「token.json」に変えて、取得済みのtokenの情報を入力してください。'
    );
    return;
  }

  const tokens = JSON.parse(tokensJson);

  if ('access_token' in tokens) {
    sample(tokens.access_token);
  }
}

main();