# HorrorMovie_suvRate
ホラー映画における職業ごとの生存率を求める

# データ
## ダウンロード
- https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/tree/main/data
## SPARQLエンドポイント
- EndpointのURL https://lod.hozo.jp/fuseki/horror_movie/sparql
- [検索用Web GUI](https://yasgui.triply.cc/?endpoint=https://lod.hozo.jp/fuseki/horror_movie/sparql)

## サンプルクエリ
[サンプルクエリ](https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/blob/main/sample_queries.md)

# TODO
- サンプルクエリを作ってアップ
- （できるなら）アプリに組み込む？
- 説明資料(レポジトリにMDで書くと直しやすい。PDFならレポジトリにアップしてリンク張る) 
  - どうやて作ったか？　WDからタイトル　→　LLM（プロンプト、使ったモデル）、RDFエラーをデバッグ（Jenaパーサーでチェック＋一部自動、一部手動で）
  - RDFデータの説明
 
## 目的
　ホラー映画において「どのような職業・役割が物語上で犠牲になりやすいか」を  
Linked Open Data と SPARQL によって定量分析可能な形に構造化することを目的とする。

既存の映画データベース（Wikidata 等）には登場人物の職業別統計や生死情報は存在しないため、  
本研究では映画内容に基づく推定統計データをLODとして構築し、  
映画ジャンルにおける物語構造の傾向分析を可能にする。

## データ作成方法

本システムのRDFデータは、既存のオープンデータとChatgpt5-nanoを組み合わせて作成したものである。作成手順は以下の通りである。

① 映画タイトルの取得（Wikidata）

まず、ホラー映画の基礎データとして Wikidata（WD） を利用し、映画タイトルを収集した。
Wikidataは構造化された知識グラフであり、映画の正式名称・識別子（QID）など信頼性の高い情報を取得できるため、タイトルの正確性を担保する基盤データとして用いた。

② LLMによる役職・死亡情報の生成

取得した各映画タイトルを入力として、大規模言語モデル（LLM）を用いて以下の情報を生成した。

映画に登場する職業（例：警察官、医師、学生など）

各職業ごとの死亡人数

生存者の有無

使用した要素

入力：映画タイトル

出力形式：RDF/Turtle形式

プロンプト設計：

出力をRDF構文に固定

職業・死亡数を構造化データとして記述させる制約を付与

不要な文章出力を抑制する指示を追加

これにより、人手で抽出するには困難な「役職別被害情報」を自動生成した。

③ RDFエラーの検証とデバッグ

LLM出力はそのままでは構文エラーを含むことがあるため、機械的検証＋人手修正の2段階で整形した。

■ 自動検証

Apache JenaのRDFパーサーを用いてTurtle構文チェックを実施した。

主な検出エラー：

トリプル終端の「.」抜け

プレフィックス未定義

型指定（xsd:integer）の誤り

文字列リテラルの閉じ忘れ

これらはスクリプトにより可能な範囲で自動修正した。

■ 手動修正

自動修正できない以下の問題は目視で修正した。

職業名の表記ゆれ（例：police / police officer）

明らかに不自然な死亡数

文脈的に誤った役職分類

④ 最終データの構造

最終的なRDFは以下のような構造を持つ。

映画（Movie）

タイトル

役職統計へのリンク

役職統計（RoleStats）

職業

死亡人数

これにより、SPARQLによる

職業別死亡数

映画別死亡数

生存率分析

が可能になっている。
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
