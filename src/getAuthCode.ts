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

  const filename = path.join(__dirname, 'get.html');
  const template = fs.readFileSync(filename, 'utf-8');

  const html = template.replace('${code}', code);

  res.end(html);
}

function post(req: http.IncomingMessage, res: http.ServerResponse): void {
  req.setEncoding('utf-8');
  req.on('data', bodyQuerystring => {
    const data = querystring.parse(bodyQuerystring);
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const params = {} as getToken.Params;
    ['redirect_uri', 'client_id', 'client_secret', 'code'].forEach(key => {
      if (!(key in data)) {
        res.end(
          postHtmlTemplate(
            'トークンの取得ができませんでした',
            `送信されたデータに${key} が存在しません。`
          )
        );
        throw 'error';
      }
      if (data[key] instanceof Array) {
        res.end(
          postHtmlTemplate(
            'トークンの取得ができませんでした',
            `送信されたデータ${key}の形式が正しくありません。`
          )
        );
        throw 'error';
      }

      params[key as keyof getToken.Params] = data[key] as string;
    });

    getToken
      .process(params)
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
        const html = postHtmlTemplate(
          'トークンの取得ができませんでした',
          reason
        );
        res.end(html);
      });
  });
}

function server(req: http.IncomingMessage, res: http.ServerResponse): void {
  if (req.method == 'GET') {
    get(req, res);
    return;
  }

  if (req.method == 'POST') {
    post(req, res);
  }
}

function main(): void {
  httpServer = http.createServer(server);
  httpServer.listen(8080, '127.0.0.1');

  console.log('Webアプリ認証用URLをブラウザで開いて、認証を開始してください。');
  console.log('Ctrl+Cを押すと、コールバックの受け待ちを終了します。');
}

main();
