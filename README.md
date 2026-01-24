# ホラー映画死亡数LOD
ホラー映画において「どのような職業・役割が物語上で犠牲になりやすいか」を SPARQL によって定量分析可能な形に構造化したデータを作成し、Linked Open Data として公開しました。
ホラー映画の一覧は、既存のオープンな知識グラフであるWikidataから取得できますが、このデータには登場人物の職業別統計や生死情報は存在しません．
そこで本作品では、映画のタイトルをもとにしたゼロ・ショットプロンプトを用いて，LLM（ChatGPT）から映画の内容に基づく職業別の志望者の数を推定した統計データを構築し、LODとして構築した。このデータにより、ホラー映画ジャンルにおける犠牲者の傾向分析を可能にする。

# データ
## ダウンロード
- https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/tree/main/data
## SPARQLエンドポイント
- EndpointのURL https://yasgui.triply.cc/?endpoint=https://lod.hozo.jp/fuseki/horror_movie/sparql
- [検索用Web GUI](https://yasgui.triply.cc/?endpoint=https://lod.hozo.jp/fuseki/horror_movie/sparql)

## サンプルクエリ
[サンプルクエリ](https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/blob/main/sample_queries.md)

## アプリケーションの説明
[アプリケーションについて](https://github.com/oecu-kozaki-lab/HorrorMovie_suvRate/blob/main/Application_description.md)

[アプリケーション実行用Webページ](https://oecu-kozaki-lab.github.io/HorrorMovie_suvRate/)

## データ作成方法

本システムのRDFデータは、既存のオープンデータとChatgpt5-nanoを組み合わせて作成したものである。作成手順は以下の通りである。

### 1.映画タイトルの取得（Wikidata）

ホラー映画の基礎データとしてWikidata（WD）を利用し、映画タイトルを収集した。
Wikidataは構造化された知識グラフであり、映画の正式名称・識別子（QID）など信頼性の高い情報を取得できるため、タイトルの正確性を担保する基盤データとして用いた。

### 2.LLMによる役職・死亡情報の生成

取得した各映画タイトルを入力として、大規模言語モデル（LLM）を用いて以下の情報を生成した。

* 映画に登場する職業（例：警察官、医師、学生など）
* 各職業ごとの死亡人数
* 生存者の有無
* 使用した要素
* 入力：映画タイトル
* 出力形式：RDF/Turtle形式
* プロンプト設計：
  * 出力をRDF構文に固定
  * 職業・死亡数を構造化データとして記述させる制約を付与
  * 不要な文章出力を抑制する指示を追加

これにより、人手で抽出するには困難な「役職別被害情報」を自動生成した。

### 3.RDFエラーの検証とデバッグ

LLM出力はそのままでは構文エラーを含むことがあるため、機械的検証＋人手修正の2段階で整形した。

* 自動検証：  
  * Apache JenaのRDFパーサーを用いてTurtle構文チェックを実施した。
  これらはスクリプトにより可能な範囲で自動修正した。

* 手動修正：  
  * 自動修正できない以下の問題は目視で修正した。  
  * トリプル終端記号「.」が誤った位置に挿入されている箇所の削除  
  * 語の途中やURI直後に不要な 半角スペース が混入している箇所の削除  

### 4.最終データの構造

最終的なRDFは以下のような構造を持つ。
* 映画（Movie）
* タイトル
* 役職統計へのリンク
* 役職統計（RoleStats）
* 職業
* 死亡人数

これにより、SPARQLによる職業別死亡数の検索、映画別死亡数の検索等が可能になっている。

## データの説明
* クラス
  * ex:Movie　映画作品を表すクラス。

* 述語	内容
  * `ex:title`	映画タイトル
  * `ex:estimatedTotalCharacters`	登場人物総数（推定値を含む）
  * `ex:countType`	人数が推定値か実数か
  * `ex:hasRoleStats`	職業別統計へのリンク
  * `ex:RoleStatistics`　映画内の職業ごとの死亡統計情報を表すクラス。

* 述語	内容
  * ex:role	対象職業
      * 例：
        ex:Police, 
        ex:Student, 
        ex:Scientist 
  * ex:deathCount	職業の死亡人数
  * ex:countType	死亡数が推定値かどうか
  

## データモデル
本データは、ホラー映画における登場人物の死亡傾向を職業別に分析することを目的として構築したRDFデータである。  
### 基本構造
中心となるのは以下の3つの概念であり、映画ごとにどの職業の人物が何人死亡したかを記述する構造になっている。
1. **映画**
2. **職業別統計**
3. **職業**
```
職業一覧
hm:Civilian   "一般市民"@ja
hm:Soldier    "兵士"@ja
hm:Student    "学生"@ja
hm:Scientist  "研究者"@ja
hm:Security   "警備員"@ja
hm:Police     "警官"@ja
```
### 具体例：「13日の金曜日」
本データモデルは 「映画」→「職業別統計」→「職業」 という階層構造を持ち、以下は「13日の金曜日」を例とした構造図である。  
<img width="1421" height="593" alt="image" src="https://github.com/user-attachments/assets/853a047d-31b3-44b6-89ee-2703b11584d3" />
#### **1. 映画**  
* hm:Movie_Q1454815 は1本の映画を表すインスタンスである。  
* rdf:type hm:Movieは映画インスタンスに属することが示されている。  
* hm:title により日本語タイトルが付与されている。 
* rdfs:seeAlsoによりWikidata上の同一映画エンティティへのリンクを持ち、外部LODとの接続が確保されている。  
* hm:estimatedTotalCharacters には登場人物の総数（ここでは14）が記録されているが、これは正確な統計ではなく分析目的の推定値であるため、hm:countType hm:Estimated により「推定値」であることが明示されている。  

#### **2. 職業別統計**  
一般市民や学生など、職業ごとの統計情報を表している  
* hm:role hm:Civilian によって対象職業が一般市民であることを示す。  
* hm:deathCount 4 により、この映画内で一般市民が4人死亡したことが記録されている。同様に hm:Movie_Q1454815_RoleStats_Student では、学生の死亡数が5人であることが記述されている。これらの統計値も映画全体の人数と同様に hm:countType hm:Estimated が付与され、推定値であることが示されている。

#### **3. 職業**  
* 職業そのものは単なる文字列ではなく、hm:Civilianやhm:Studentのような独立したリソースとして定義されている。  
  **>Point**: この設計により、同一職業を複数の映画間で共通利用でき、SPARQLによる横断的な統計分析が可能となる。

以上のように、各映画における職業ごとの死亡数をLOD形式で整理したものである。これにより、「警官の死亡が多い映画はどれか」「職業別の死亡数合計」「映画間の死亡傾向比較」といった分析が可能になる。一方で、職業ごとの登場人数や生存人数は記録していないため、厳密な死亡数ではなく「死亡傾向の分析」を目的としたデータである点に注意が必要である。

このように、本RDFはホラー映画の死亡描写を職業という観点から構造化し、統計的分析を可能にするためのデータモデルである。
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
