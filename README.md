# 会計freee TypeScript API Helper
## 概要
会計freeeのAPIをTypeScriptで使うためのラッパーです。

[freee/freee-api-schema](https://github.com/freee/freee-api-schema/)にある、[/open-api-3/api-schema.json](https://github.com/freee/freee-api-schema/tree/master/open-api-3)のデータに基づき、[openapi-generator](https://github.com/OpenAPITools/openapi-generator)を使って、アクセス用関数を自動生成しています。

## 使用方法
### 事前準備
あらかじめ、`node.js`をインストールしてください

### インストール

#### リポジトリのクローン（ダウンロード）
`git clone （このリポジトリ）`

#### カレントディレクトリの移動
`cd freeeapi-typescript-helper`

#### npmパッケージの（ローカル）インストール
`npm install`

#### 会計freee TypeScript API Helperに必要なファイルを生成 
`npm run apibuild`


### デモの実行
#### freeeアプリストアへのアプリケーション登録

`client_id` および `client_secret` を取得するため、freeeアプリストアの開発者ページでアプリケーションを登録します。

**コールバックURLは、最初の状態のまま`urn:ietf:wg:oauth:2.0:oob`にしておいてください**。

手順はこちら→[freeeヘルプ-アプリケーションを作成する](https://app.secure.freee.co.jp/developers/tutorials/2-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)

#### 認可コード、アクセストークンの取得
認可コードの取得、アクセストークンを取得します。

手順はこちら→[freeeヘルプ-アクセストークンを取得する](https://app.secure.freee.co.jp/developers/tutorials/3-アクセストークンを取得する#認可コードを取得する)


#### アクセストークンの指定

src\token_example.ts　ファイルを、src\token.ts　にコピーしてください。

その後、freeeAPIにアクセスするためのtokenを指定してください。

```JavaScript src/token_example.ts
export const accessToken =
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
```
↓
```JavaScript src/token.ts
export const accessToken =
  'abc12345abc12345abc12345abc12345abc12345abc12345abc12345abc123';
```

#### デモの実行

`npm run start`で、デモを実行することができます。

- １件目の会社コード
- その会社コードの貸借対照表

が出力されます。

デモのソースコードは、`src/index.ts`に入っています。


### 既知の不具合

Partners APIの設定に不具合があり、引数または返り値の自動補完が効きません。

ひょっとしたら、正常に情報を取得できないかもしれません。

その他も、動作テストは、ほとんどしていませんので、安定していない可能性があります。