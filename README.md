# 会計freee TypeScript API Helper
## 概要
会計freeeのAPIをTypeScriptで使うためのラッパーです。

[freee/freee-api-schema](https://github.com/freee/freee-api-schema/)にある、[/open-api-3/api-schema.json](https://github.com/freee/freee-api-schema/tree/master/open-api-3)のデータに基づき、[openapi-generator](https://github.com/OpenAPITools/openapi-generator)を使って、アクセス用関数を自動生成しています。

## 使用方法
### 動作環境
- Windows10 1903
- [Node v12.13.0](https://nodejs.org/ja/)
- [Git BASH 4.4.23](https://gitforwindows.org/)

find xargs patchなどを使っているので、DOSプロンプトやPower Shellでは動かない可能性が高いです。

### 事前準備
あらかじめ、下記をインストールしておいてください。

- [Node.js](https://nodejs.org/ja/)
- [Git BASH](https://gitforwindows.org/)
- [Java JRE](https://java.com/ja/download/)

### インストール

git BASHで下記のコマンドを実行してください。

#### 1. リポジトリのクローン（ダウンロード）
任意のディレクトリに移動後、
`git clone https://github.com/m-haketa/freeeapi-typescript-helper.git`

<br>

#### 2. カレントディレクトリの移動
`cd freeeapi-typescript-helper`

<br>

#### 3. npmパッケージの（ローカル）インストール
`npm install`

<br>

#### 4. 会計freee TypeScript API Helperに必要なファイルを生成 
`npm run apibuild`

<br>

### デモの実行

#### 1. freeeアプリストアへのアプリケーション登録

`client_id` および `client_secret` を取得するため、freeeアプリストアの開発者ページでアプリケーションを登録します。

このとき、**必ず、コールバックURLを、`http://127.0.0.1:8080/`に設定してください**。

<br >

参考URL↓

[freeeヘルプ-アプリケーションを作成する](https://app.secure.freee.co.jp/developers/tutorials/2-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)

<br>

#### 2. Client ID、Client Secretの取得

下記ページの「1.」で表示されているClient ID、Client Secretを「src/token/clientdata.json」に入力してください。

``` json src/token/clientiddata.json
{
  "client_id": "ここにCLIENT_IDを入れる",
  "client_secret": "ここにCLIENT_SECRETを入れる"
}

```

参考URL↓

[freeeヘルプ-アクセストークンを取得する](https://app.secure.freee.co.jp/developers/tutorials/3-アクセストークンを取得する#認可コードを取得する)

<br>

#### 3. 認可コードの取得、コールバック用プログラムの実行
認可コードを取得します。

下記ページの「認可コードを取得する」を参考に、**Webアプリ認証用URLをブラウザで開いてください**

`npm run gettoken` を実行してください。

実行すると、下記のように表示されます。

```
Webアプリ認証用URLをブラウザで開いて、認証を開始してください。
Ctrl+Cを押すと、コールバックの受け待ちを終了します。

Webアプリ認証用URL:
https://accounts.secure.freee.co.jp/public_api/token/?XXXXX
```

このメッセージが表示されたら、**最後に表示されたURLを開いてください**。

すると、自動でトークンが取得され、トークンの情報は「src/token/tokendata.json」に保存されます。

<br>

#### ※すでにトークン取得済みの場合
すでに取得済みのトークンがある場合には、上記1~4の手順の代わりに、次のようにしてトークンの情報を保存してください。

1. src/token/tokendata_example.json　ファイルを、src/token/tokendata.json　にコピー
2. tokendata.json に取得済みのトークンを入力する

``` json src/token/tokendata.json
{
  "access_token":"XXX",
  "token_type":"bearer",
  "expires_in":86400,
  "refresh_token":"XXX",
  "scope":"XXX",
  "created_at":0
}
```
↓
``` json src/token/tokendata.json
{
  "access_token":"abc12345abc12345abc12345abc12345abc12345abc12345abc12345abc12345",
  "token_type":"bearer",
  "expires_in":86400,
  "refresh_token":"12345abc12345abc12345abc12345abc12345abc12345abc12345abc12345abc",
  "scope":"XXX",
  "created_at":0
}
```

**最低限、access_tokenだけ入力できていれば、デモは動きます**。

<br>

#### 4. デモの実行

`npm run demo`で、デモを実行することができます。

- １件目の会社コード
- その会社コードの貸借対照表

が出力されます。

デモのソースコードは、`src/index.ts`に入っています。

<br>

### 既知の不具合

- Partners APIの設定に不具合があり、ファイルが正しく生成されません。エラーが出るおそれがあるためパッチを当てています。その影響で、引数または返り値の自動補完が効きません。さらに、正常に情報を取得できない可能性もあります。
- Company(get) APIの設定に不具合があり、自動生成されたプログラムだと、返り値の一部を自動的にカットしてしまい、データが読み込めないためパッチを当てています。その影響で、返り値の自動補完が完全には効きません。

その他のAPIについても、動作テストは、ほとんどしていませんので、安定していない可能性があります。