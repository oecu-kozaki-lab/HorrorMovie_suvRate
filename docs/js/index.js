let myChart = null;

window.onload = () => {
    let titleIndex = document.getElementById("inputTitle");

    suggestTitles(titleIndex);

    titleIndex.onkeydown = (e) => {
        if(e.key === "Enter"){
            e.preventDefault();
            createQuery(titleIndex.value);
        }
    }
}

suggestTitles = (inputElement) => {
    let endpoint = "https://lod.hozo.jp/kz-fuseki/horror_movie/sparql";
    const query = `
        prefix hm:   <https://kozaki-lab.jp/lod/horror_movie#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT DISTINCT ?title
        WHERE {
            ?movie a hm:Movie ;
                     hm:title ?title .
        }
        ORDER BY ?title
    `;

    const params = new URLSearchParams();
    params.append('query', query);

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => {
        if (!response.ok){
            console.log("データの取得に失敗しました", response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const titles = data.results.bindings.map(item => item.title.value);
        const dataList = document.getElementById("movieTitles");
        dataList.innerHTML = "";
        titles.forEach(title => {
            const option = document.createElement("option");
            option.value = title;
            dataList.appendChild(option);
        });
    })
}

function createQuery(movieTitle){
    if(!movieTitle) return;

    const query = `
        prefix hm:   <https://kozaki-lab.jp/lod/horror_movie#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?totalCharacters ?roleName ?deathCount ?wikiLink
        WHERE {
            ?movie a hm:Movie ;
                   hm:title "${movieTitle}"@ja ;
                   hm:estimatedTotalCharacters ?totalCharacters ;
                   hm:hasRoleStats ?stats .

            ?stats hm:role ?roleEntity ;
                   hm:deathCount ?deathCount .

            ?roleEntity rdfs:label ?roleName .

            OPTIONAL {?movie rdfs:seeAlso ?wikiLink .}
        }
        ORDER BY DESC(?deathCount)
    `;

    getData(query, movieTitle);
}

function getData(query, movieTitle){
    let endpoint = "https://lod.hozo.jp/kz-fuseki/horror_movie/sparql";
    const params = new URLSearchParams();
    params.append('query', query);

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Accept': 'application/sparql-results+json',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
    })
    .then(response => {
        if (!response.ok){
            console.log("データの取得に失敗しました", response.statusText);
        }
        return response.json();
    })
    .then(data => {
        showResult(data, movieTitle);
    })
    .catch(error => {
        document.getElementById("result").innerHTML = "<p>データの取得に失敗しました</p>";
    });
}

function showResult(data, title){
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "";

    if (!data.results.bindings.length) {
        resultDiv.innerHTML = "<h3>該当するデータがありません</h3>";
        return;
    }

    const bindings = data.results.bindings;

    const total = bindings[0].totalCharacters.value;
    const labels = bindings.map(item => item.roleName.value);
    const deaths = bindings.map(item => parseInt(item.deathCount.value));
    const wikiLink = bindings[0].wikiLink ? bindings[0].wikiLink.value : null;

    let titleHTML = "";
    if (wikiLink) {
        titleHTML = `<a href="${wikiLink}" target="_blank" rel="noopener noreferrer">${title}</a>`;
    }else{
        titleHTML = title;
    }

    resultDiv.innerHTML = `
        <h2 style="margin-bottom: 10px;">${titleHTML}</h2>
        <div style="font-size: 1.2em; margin-bottom: 20px;">
            登場人物総数: <strong>${total}</strong> 人
        </div>
        <div style="position: relative; height: 400px; width: 100%;">
            <canvas id="myChart"></canvas>
        </div>
    `;
    const ctx = document.getElementById('myChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '死亡者数',
                data: deaths,
                backgroundColor: 'rgba(200, 50, 50, 0.6)', 
                borderColor: 'rgba(200, 50, 50, 1)',
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}