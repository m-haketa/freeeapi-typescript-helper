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
あらかじめ、[Node.js](https://nodejs.org/ja/)と、[Git BASH](https://gitforwindows.org/)などのlinux用コマンドが使える環境をインストールしてください

### インストール

git BASHで下記のコマンドを実行してください。

#### 1. リポジトリのクローン（ダウンロード）
任意のディレクトリに移動後、
`git clone https://github.com/m-haketa/freeeapi-typescript-helper.git`

<br>

#### 2. JREのインストール

[https://java.com/ja/download/](https://java.com/ja/download/)からJava JREをインストールしてください。


#### 3. カレントディレクトリの移動
`cd freeeapi-typescript-helper`

<br>

#### 4. npmパッケージの（ローカル）インストール
`npm install`

<br>

#### 5. 会計freee TypeScript API Helperに必要なファイルを生成 
`npm run apibuild`

<br>

### デモの実行
#### 1. コールバック用プログラムの実行
`npm run gettoken` を実行してください。

実行すると、下記のように表示されます。

```
Webアプリ認証用URLをブラウザで開いて、認証を開始してください。
Ctrl+Cを押すと、コールバックの受け待ちを終了します。
```

<br>

#### 2. freeeアプリストアへのアプリケーション登録

`client_id` および `client_secret` を取得するため、freeeアプリストアの開発者ページでアプリケーションを登録します。

このとき、**必ず、コールバックURLを、`http://127.0.0.1:8080/`に設定してください**。

<br >

参考URL↓

[freeeヘルプ-アプリケーションを作成する](https://app.secure.freee.co.jp/developers/tutorials/2-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)

<br>

#### 3. 認可コードの取得
認可コードを取得します。

下記ページの「認可コードを取得する」を参考に、**Webアプリ認証用URLをブラウザで開いてください**

<br>

参考URL↓

[freeeヘルプ-アクセストークンを取得する](https://app.secure.freee.co.jp/developers/tutorials/3-アクセストークンを取得する#認可コードを取得する)

<br>

#### 4. アクセストークンの取得

- client ID
- client Secret

を入力する画面に遷移しますので、その2つを入力してください。

トークンの情報は「src/token.json」に保存されます。

<br>

#### ※すでにトークン取得済みの場合
すでに取得済みのトークンがある場合には、上記1~4の手順の代わりに、次のようにしてトークンの情報を保存してください。

1. src/token_example.json　ファイルを、src/token.json　にコピー
2. token.json に取得済みのトークンを入力する

```json
{"access_token":"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
```
↓
```json
{"access_token":"abc12345abc12345abc12345abc12345abc12345abc12345abc12345abc12345"}
```

<br>

#### 5. デモの実行

`npm run demo`で、デモを実行することができます。

- １件目の会社コード
- その会社コードの貸借対照表

が出力されます。

デモのソースコードは、`src/index.ts`に入っています。

<br>

### 既知の不具合

Partners APIの設定に不具合があり、引数または返り値の自動補完が効きません。さらに、正常に情報を取得できない可能性もあります。

その他のAPIについても、動作テストは、ほとんどしていませんので、安定していない可能性があります。