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
