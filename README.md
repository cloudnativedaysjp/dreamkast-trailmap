# dreamkast-trailmap
Tools for dreamkast trailmap

## 事前準備

- yarn installを実行
- AWSにSSOログイン
- AWS_REGIONを、作業したい環境に応じて指定
  - dev: us-east-2
  - stg/prd: ap-northeast-1


## QRコード生成

- [過去カンファレンスのポイントイベント定義ファイル](./data/cicd2023PointEvent.yaml)を参考に、 ポイントイベント定義ファイルを作成してください。

- 以下を参考に、load-point-eventコマンドを実行してください

```shell
# devの場合
$ yarn run load-point-event [上記定義ファイルへのパス] dev

# stg/prdの場合
$ yarn run load-point-event [上記定義ファイルへのパス] [stg|prd] [random salt]  # ここで指定したsaltは、dk-uiの環境変数でも指定が必要です
```


## 利用者の獲得ポイント一覧取得

- 以下のような、ユーザのIDとemailの一覧をcsvとして生成してください。
  - TODO: dreamkast側でユーザ一覧のAPIを開けて、自動で取得できるようにする 

```csv
id,email
1000,taro@example.com
1001,hanako@example.com
...
```

- 上記csvを指定して、以下を実行してください。

```shell
$ yarn run --silent get-total-points [上記csvへのパス] [カンファレンス略称] [dev|stg|prd] > data/points.csv
```


## 抽選

- 上記で取得した利用者獲得ポイント一覧を指定して、以下を実行してください。

```shell
$ yarn run --silent sweepstakes [上記で取得したポイント一覧] [当選人数]
```

- スタッフを抽選対象から除外したい場合は、[sweepstakes.ts](./cmd/sweepstakes.ts)の上部の定数で指定されたignore fileに名前を追加してください。

```shell
$ cat data/ignoreUsers.txt 
taro@example.com
hanako@example.com
...
```
