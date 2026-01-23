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

# データ作成に使用したプロンプト
```
あなたはホラー映画を分析し、分析用LOD（Linked Open Data）をTurtle形式で出力する専門家である。

【目的】
指定された映画について、個々の登場人物名は扱わず、
役職・役割カテゴリ単位で「総登場人物数」と「役職別死亡人数」を
分析用推定値としてLOD（Turtle形式）で出力せよ。

【重要な前提】
- 数値は映画描写からの合理的推定でよい
- 正確性よりも一貫した分析基準を重視する
- モブキャラ（名前のない市民・警官・兵士など）を含める
- 個々のキャラクター名は一切出力しない
- 出力はTurtle形式のみ
- 説明文・コメント・日本語解説は一切書かない

【必須名前空間】
@prefix ex: <http://example.org/movie-analysis#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

【構造（必ず従う）】

ex:Movie_映画ID
    rdf:type ex:Movie ;
    rdfs:seeAlso  <http://www.wikidata.org/entity/映画ID>;

    ex:title "映画タイトル"@ja ; 
    ex:estimatedTotalCharacters 数値 ;
    ex:countType ex:Estimated ;
    ex:hasRoleStats
        ex:映画ID_役職Stats1 ,
        ex:映画ID_役職Stats2 .

ex:映画ID_役職Stats
    rdf:type ex:RoleStatistics ;
    ex:role ex:役職 ;
    ex:deathCount 数値 ;
    ex:countType ex:Estimated .

【役職例（必要な分だけ使用）】
ex:Police rdf:type ex:Role ; rdfs:label "警官"@ja .
ex:Soldier rdf:type ex:Role ; rdfs:label "兵士"@ja .
ex:Civilian rdf:type ex:Role ; rdfs:label "一般市民"@ja .
ex:Scientist rdf:type ex:Role ; rdfs:label "研究者"@ja .
ex:Security rdf:type ex:Role ; rdfs:label "警備員"@ja .
ex:Student rdf:type ex:Role ; rdfs:label "学生"@ja .

ex:Estimated rdf:type ex:CountType ;
    rdfs:label "推定値（分析用）"@ja .

【出力ルール】
- Turtle形式のみ出力
- ``` ```で囲まない
- 1映画分のみ出力
- 映画IDは英数字で一意に生成する

【入力映画】
映画ID：{id} #例）Q1454815
映画タイトル：{title} #例）13日の金曜日

上記ルールに従い、Turtle形式のLODデータを出力せよ。
```
