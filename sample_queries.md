# サンプルクエリ
## 各映画において、どの職業の人が何人死亡したかを一覧表示するクエリ
```
prefix hm:    <https://kozaki-lab.jp/lod/horror_movie#>
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> 

select * 
where{
 ?movie a hm:Movie ;
          rdfs:seeAlso ?wd ;
          hm:title   ?title .
  ?movie  hm:hasRoleStats ?stat.
  ?stat   hm:deathCount  ?c ;
          hm:role/rdfs:label ?role.
}
```
[クエリの実行](https://api.triplydb.com/s/o2j-Lym8M)

## 全映画データを対象に「映画ごとの死亡数合計」を算出し、降順に並べ替えるクエリ
```
prefix ex:    <http://example.org/movie-analysis#>
prefix xsd:   <http://www.w3.org/2001/XMLSchema#>
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

select ?movie ?title (sum(?deathCount) as ?totalDeaths)
where {
  ?movie a ex:Movie ;
         ex:title ?title ;
         ex:hasRoleStats ?stat .

  ?stat ex:deathCount ?deathCount .
}
group by ?movie ?title
order by desc(?totalDeaths)
```

## 全映画データを対象に「職業ごとの死亡数合計」を算出し、降順に並べ替えるクエリ
```
prefix ex:    <http://example.org/movie-analysis#>
prefix xsd:   <http://www.w3.org/2001/XMLSchema#>
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

select ?roleLabel (sum(xsd:integer(?deathCount)) as ?totalDeaths)
where {
  ?movie a ex:Movie ;
         ex:hasRoleStats ?stat .

  ?stat ex:deathCount ?deathCount ;
        ex:role ?role .

  ?role rdfs:label ?roleLabel .
}
group by ?roleLabel
order by desc(?totalDeaths)
