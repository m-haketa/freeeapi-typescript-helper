import http from 'http';
import url from 'url';
import getToken from './getToken';

function server(req: http.IncomingMessage, res: http.ServerResponse): void {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  const requestUrl = req.url || '';
  const query = url.parse(requestUrl, true).query;

  res.write('<h2>querystrings</h2>');
  res.write(JSON.stringify(query));

  if (!('code' in query)) {
    res.end('');
    return;
  }

  const code = query.code;
  if (code instanceof Array) {
    res.end('');
    return;
  }

  getToken(code)
    .catch(reason => {
      throw reason;
    })
    .finally(() => {
      res.end('トークンの取得処理が完了しました');
    });
}

function main(): void {
  http.createServer(server).listen(8080, '127.0.0.1');
}

main();
