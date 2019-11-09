import * as Api from './freeeapi/api';

//token_example.tsのファイル名をtoken.tsに変更して、
//アクセストークンを入力してください。
import { accessToken } from './token';

async function main(): Promise<boolean> {
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

main();
