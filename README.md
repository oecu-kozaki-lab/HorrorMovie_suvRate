# HorrorMovie_suvRate
ホラー映画における職業ごとの生存率を求める

# SPARQLエンドポイント
- EndpointのURL https://lod.hozo.jp/kz-fuseki/horror_movie/sparql
- [検索用Web GUI](https://yasgui.triply.cc/?endpoint=https://lod.hozo.jp/kz-fuseki/horror_movie/sparql)
# サンプルクエリ
## ○○を調べる
```
prefix ex:    <http://example.org/movie-analysis#>
prefix xsd:   <http://www.w3.org/2001/XMLSchema#> 
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> 

select * 
where{
 ?movie a ex:Movie ;
        ex:title   ?title .
  ?movie ex:hasRoleStats ?stat.
  ?stat  ex:deathCount  ?c ;
        ex:role/rdfs:label ?role.
}
```
[クエリの実行](https://api.triplydb.com/s/vRQTsFakW)
