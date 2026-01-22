# HorrorMovie_suvRate
ホラー映画における職業ごとの生存率を求める

# SPARQLエンドポイント
- EndpointのURL https://lod.hozo.jp/kz-fuseki/horror_movie/sparql
- [検索用Web GUI](https://yasgui.triply.cc/?endpoint=https://lod.hozo.jp/kz-fuseki/horror_movie/sparql)

## [サンプルクエリ](https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/blob/main/sample_queries.md)

# TODO
- CSV3を作り直して、別のフォルダにTTLをアップする　→　古崎が処理してアップする
- サンプルクエリを作ってアップ
- （できるなら）アプリに組み込む？
- 説明資料(レポジトリにMDで書くと直しやすい。PDFならレポジトリにアップしてリンク張る) 
  - なぜ作ったか？何ができる？
  - どうやて作ったか？　WDからタイトル　→　LLM（プロンプト、使ったモデル）、RDFエラーをデバッグ（Jenaパーサーでチェック＋一部自動、一部手動で）
  - RDFデータの説明
