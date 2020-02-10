import * as Api from './freeeapi/api';
import * as Token from './Token';

async function sample(accessToken: string): Promise<boolean> {
  //会社一覧取得
  try {
    const companyApi = new Api.CompaniesApi();
    companyApi.accessToken = accessToken;

    const companyRoot = await companyApi.getCompanies().catch(r => {
      throw r;
    });
    console.log('---会社一覧---');
    console.log(companyRoot.body.companies);

    //１つ目の会社のIDを取得
    const companyId = companyRoot.body.companies[0].id;

    //試算表BS取得
    const trialBsApi = new Api.TrialBalanceApi();
    trialBsApi.accessToken = accessToken;

    const trialBsRoot = await trialBsApi.getTrialBs(companyId).catch(r => {
      throw r;
    });
    console.log('---試算表(BS)---');
    console.log(trialBsRoot.body.trialBs);
  } catch (reason) {
    console.log(reason);
    return false;
  }
  return true;
}

function main(): void {
  const token = Token.get();
  sample(token.access_token);
}

main();
