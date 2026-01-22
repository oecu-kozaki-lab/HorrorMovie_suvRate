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
  - 
## データの説明
- クラス
  - 職業：警官、。。。。   
- 述語
  

## 説明サンプル図用
https://www.kanzaki.com/works/2009/pub/graph-draw
```
@prefix ex: <http://example.org/movie-analysis#> .
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

ex:Police rdf:type ex:Role ; rdfs:label "警官"@ja .
ex:Soldier rdf:type ex:Role ; rdfs:label "兵士"@ja .

ex:Estimated rdf:type ex:CountType ;
    rdfs:label "推定値（分析用）"@ja .

ex:Movie_13Ghosts
    rdf:type ex:Movie ;
    ex:title "13ゴースト"@ja ;
    ex:estimatedTotalCharacters 26 ;
    ex:countType ex:Estimated ;
    ex:hasRoleStats
        ex:Movie_13Ghosts_RoleStats1 ,
        ex:Movie_13Ghosts_RoleStats2.

ex:Movie_13Ghosts_RoleStats1
    rdf:type ex:RoleStatistics ;
    ex:role ex:Police ;
    ex:deathCount 2 ;
    ex:countType ex:Estimated .

ex:Movie_13Ghosts_RoleStats2
    rdf:type ex:RoleStatistics ;
    ex:role ex:Soldier ;
    ex:deathCount 0 ;
    ex:countType ex:Estimated .
```
<img width="1139" height="596" alt="image" src="https://github.com/user-attachments/assets/84d2750d-1bde-4568-83d2-5ca5c9a46342" />
