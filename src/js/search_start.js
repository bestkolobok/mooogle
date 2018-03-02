let movie_collection = document.getElementById('searchMovie');
let search_blcok = document.getElementsByClassName('search');

//место, куда пользователь вводит запрос
let searchInput_onFocus = function (){
    document.getElementById('search-form_input_search').style.border = 'none';
};

const onClick = (event) => {
    //TODO put future button className in first if
    if (event.target.className === "Some Future Class") {
        search_blcok.classList.remove('search_hidden');
        movie_collection.classList.add('black-background');
    }
    if (event.target.className !== "search") {
        search_blcok.classList.add('search_hidden');
        movie_collection.classList.remove('black-background');
    }
};

document.addEventListener("click", onClick);