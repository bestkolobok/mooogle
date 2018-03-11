let movie_collection = document.getElementById('searchMovie');
let search_blcok = document.getElementsByClassName('search');
//место, куда пользователь вводит запрос
let searchInput_onFocus = function (){
    document.getElementById('search-form_input_search').style.border = 'none';
}

const onClick = (event) => {
    if (event.target.className === "Some Future Class") {
        search_blcok.classList.remove('search_hidden');
        movie_collection.classList.add('bg');
    }
    if (event.target.className !== "search") {
        search_blcok.classList.add('search_hidden');
    }
}

document.addEventListener("click", onClick);