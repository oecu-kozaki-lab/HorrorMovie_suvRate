# サンプルクエリ
## ○○を調べる
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

## ○○を調べる
```
## ○○を調べる
```
