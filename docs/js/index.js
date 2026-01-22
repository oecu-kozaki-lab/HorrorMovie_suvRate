onload = () => {
    let titleIndex = document.getElementById("inputTitle");
    titleIndex.onkeydown = (e) => {
        if(e.key === "Enter"){
            return titleIndex.value;
        }
    }
}

