let movie_collection = document.getElementById('black_background');
let search_blcok = document.getElementById('search');

//место, куда пользователь вводит запрос
let searchInput_onFocus = function () {
    document.getElementById('search-form_input_search').style.border = 'none';
};

const onClick = (event) => {
    debugger
    if (event.target.className === "head-1__search" || event.target.className === "head-1__input-search"
        || event.target.className === "head__search" || event.target.classList.contains('search-form_input_search')) {
        debugger
        search_blcok.classList.remove('search_hidden');
        search_blcok.classList.add('search_show');
        movie_collection.classList.add('black_background');
    } else if (search_blcok.classList.contains('search_show') && !event.target.classList.contains('search')
        && !event.target.classList.contains('logo') && event.target.nodeName !== 'INPUT') {
        debugger
        search_blcok.classList.add('search_hidden');
        search_blcok.classList.remove('search_show');
        movie_collection.classList.remove('black_background');
    }
};

document.addEventListener("click", onClick);