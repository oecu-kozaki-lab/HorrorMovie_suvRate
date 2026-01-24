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
prefix hm: <https://kozaki-lab.jp/lod/horror_movie#>
prefix xsd:   <http://www.w3.org/2001/XMLSchema#>
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

select ?movie ?title (sum(?deathCount) as ?totalDeaths)
where {
  ?movie a hm:Movie ;
         hm:title ?title ;
         hm:hasRoleStats ?stat .

  ?stat hm:deathCount ?deathCount .
}
group by ?movie ?title
order by desc(?totalDeaths)
```
[クエリの実行](curl https://lod.hozo.jp/fuseki/horror_movie/sparql --data query=prefix%20hm%3A%20%3Chttps%3A%2F%2Fkozaki-lab.jp%2Flod%2Fhorror_movie%23%3E%0Aprefix%20xsd%3A%20%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema%23%3E%0Aprefix%20rdfs%3A%20%20%3Chttp%3A%2F%2Fwww.w3.org%2F2000%2F01%2Frdf-schema%23%3E%0A%0Aselect%20%3Fmovie%20%3Ftitle%20%28sum%28%3FdeathCount%29%20as%20%3FtotalDeaths%29%0Awhere%20%7B%0A%20%20%3Fmovie%20a%20hm%3AMovie%20%3B%0A%20%20%20%20%20%20%20%20%20hm%3Atitle%20%3Ftitle%20%3B%0A%20%20%20%20%20%20%20%20%20hm%3AhasRoleStats%20%3Fstat%20.%0A%0A%20%20%3Fstat%20hm%3AdeathCount%20%3FdeathCount%20.%0A%7D%0Agroup%20by%20%3Fmovie%20%3Ftitle%0Aorder%20by%20desc%28%3FtotalDeaths%29 -X POST)

## 全映画データを対象に「職業ごとの死亡数合計」を算出し、降順に並べ替えるクエリ
```
prefix hm:<https://kozaki-lab.jp/lod/horror_movie#>
prefix xsd:   <http://www.w3.org/2001/XMLSchema#>
prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#>

select ?roleLabel (sum(xsd:integer(?deathCount)) as ?totalDeaths)
where {
  ?movie a hm:Movie ;
         hm:hasRoleStats ?stat .

  ?stat hm:deathCount ?deathCount ;
        hm:role ?role .

  ?role rdfs:label ?roleLabel .
}
group by ?roleLabel
order by desc(?totalDeaths)
```
[クエリの実行](https://api.triplydb.com/s/o2j-Lym8M)
