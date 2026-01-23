# HorrorMovie_suvRate
ホラー映画における職業ごとの生存率を求める

# データ
## ダウンロード
- https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/tree/main/data
## SPARQLエンドポイント
- EndpointのURL https://lod.hozo.jp/fuseki/horror_movie/sparql
- [検索用Web GUI](https://yasgui.triply.cc/?endpoint=https://lod.hozo.jp/fuseki/horror_movie/sparql)

## [サンプルクエリ](https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/blob/main/sample_queries.md)

# TODO
- CSV3を作り直して、別のフォルダにTTLをアップする　→　古崎が処理してアップする
- サンプルクエリを作ってアップ
- （できるなら）アプリに組み込む？
- 説明資料(レポジトリにMDで書くと直しやすい。PDFならレポジトリにアップしてリンク張る) 
  - なぜ作ったか？何ができる？
  - どうやて作ったか？　WDからタイトル　→　LLM（プロンプト、使ったモデル）、RDFエラーをデバッグ（Jenaパーサーでチェック＋一部自動、一部手動で）
  - RDFデータの説明
  - 
## データの説明
- クラス
  - 職業：警官、。。。。   
- 述語
  

## 説明サンプル図用
https://www.kanzaki.com/works/2009/pub/graph-draw
```
PREFIX hm:   <https://kozaki-lab.jp/lod/horror_movie#>
PREFIX rdf:  <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

hm:Movie_Q1454815  rdf:type          hm:Movie;
        rdfs:seeAlso                 <http://www.wikidata.org/entity/Q1454815>;
        hm:countType                 hm:Estimated;
        hm:estimatedTotalCharacters  14;
        hm:hasRoleStats              hm:Movie_Q1454815_RoleStats_Civilian , hm:Movie_Q1454815_RoleStats_Student;
        hm:title                     "13日の金曜日"@ja .

hm:Movie_Q1454815_RoleStats_Civilian
        rdf:type       hm:RoleStatistics;
        hm:countType   hm:Estimated;
        hm:deathCount  4;
        hm:role        hm:Civilian .

hm:Movie_Q1454815_RoleStats_Student
        rdf:type       hm:RoleStatistics;
        hm:countType   hm:Estimated;
        hm:deathCount  5;
        hm:role        hm:Student .


hm:Movie rdfs:label  "映画"@ja .

hm:RoleStatistics rdfs:label  "役職別統計"@ja .

hm:Estimated rdfs:label  "推定値（分析用）"@ja .

hm:Role  rdfs:label  "役職"@ja .

hm:Student  rdf:type  hm:Role; 
        rdfs:label  "学生"@ja .

hm:Civilian  rdf:type  hm:Role;
        rdfs:label  "一般市民"@ja .
```
<img width="1421" height="593" alt="image" src="https://github.com/user-attachments/assets/853a047d-31b3-44b6-89ee-2703b11584d3" />


