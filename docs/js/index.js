onload = () => {
    let titleIndex = document.getElementById("inputTitle");
    titleIndex.onkeydown = (e) => {
        if(e.key === "Enter"){
            createQuery(titleIndex.value);
        }
    }
}

async function createQuery(index){
    //Sparql queryを入力する変数
    const query = `
        PREFIX ex: <http://example.org/movie-analysis#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?roleName ?deathCount
        WHERE {
            ?movie a ex:Movie ;
                   ex:title "${index}"@ja ; 
                   ex:hasRoleStats ?stats .

            ?stats ex:role ?roleEntity ;
                   ex:deathCount ?deathCount .

            ?roleEntity rdfs:label ?roleName .
        }
        ORDER BY DESC(?deathCount)
    `;

    await getData(query);
}

async function getData(query){
    //fusekiのエンドポイントURLを入力する変数
    let endpoint = "https://lod.hozo.jp/kz-fuseki/horror_movie/sparql";
    let url = endpoint + "?query=" + encodeURIComponent(query) + "&format=json";

    const params = new URLSearchParams();
    params.append('query', query);
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/sparql-results+json'
        },
        body: params
    })
    .then(async response => {
        if (!response.ok) {
            throw new Error('データの取得に失敗しました');
        }
        await showResults(await response.json());
    })

}

async function showResults(data){
    //let resultsDiv = document.getElementById("results");
    //resultsDiv.innerHTML = "";
    console.log(data);
}