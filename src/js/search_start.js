let movie_collection = document.getElementById('black_background_wrapper');
let search_blcok = document.getElementById('search');

//место, куда пользователь вводит запрос
let searchInput_onFocus = function (){
    document.getElementById('search-form_input_search').style.border = 'none';
};

const onClick = (event) => {
    if (event.target.className === "head-1__search" || event.target.className === "head-1__input-search" || event.target.className === "head__search" ) {
        search_blcok.classList.remove('search_hidden');
        search_blcok.classList.add('search_show');
        movie_collection.classList.add('black-background');
    } else {
        search_blcok.classList.add('search_hidden');
        search_blcok.classList.remove('search_show');
        movie_collection.classList.remove('black-background');
    }
};

document.addEventListener("click", onClick);