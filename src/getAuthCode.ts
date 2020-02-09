import http from 'http';
import url from 'url';
import querystring from 'querystring';
import fs from 'fs';
import path from 'path';
import * as getToken from './getToken';

let httpServer: http.Server;

function postHtmlTemplate(title: string, message: string): string {
  const filename = path.join(__dirname, 'post.html');
  const template = fs.readFileSync(filename, 'utf-8');

  return template.replace('${title}', title).replace('${message}', message);
}

function get(req: http.IncomingMessage, res: http.ServerResponse): void {
  const requestUrl = req.url || '';
  const query = url.parse(requestUrl, true).query;

  if (!('code' in query)) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('');
    return;
  }

  const code = query.code;
  if (code instanceof Array) {
    res.writeHead(400, { 'Content-Type': 'text/html' });
    res.end('');
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });

  getToken
    .process(code)
    .then(filepath => {
      const html = postHtmlTemplate(
        'トークンの取得処理が完了しました',
        `トークンを ${filepath}に保存しました。`
      );

      res.end(html);

      httpServer.removeAllListeners();
      httpServer.unref();
    })
    .catch(reason => {
      const html = postHtmlTemplate('トークンの取得ができませんでした', reason);
      res.end(html);
    });
}

function server(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.method == 'GET') {
    get(req, res);
    return;
  }
}

function main(): void {
  httpServer = http.createServer(server);
  httpServer.listen(getToken.redirect_port, getToken.redirect_uri);

  console.log('Webアプリ認証用URLをブラウザで開いて、認証を開始してください。');
  console.log('Ctrl+Cを押すと、コールバックの受け待ちを終了します。');
  console.log('Webアプリ認証用URL:\n');

  const client = getToken.getID_Secret();

  console.log(
    getToken.authorize_url +
      '?' +
      querystring.stringify({
        client_id: client.client_id,
        redirect_uri: getToken.getRedirectUri(),
        response_type: 'code'
      })
  );
}

main();
