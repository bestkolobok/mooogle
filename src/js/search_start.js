let movie_collection = document.getElementById('black_background');
let search_blcok = document.getElementById('search');
let inputSearch = document.getElementsByClassName('head-1__input-search')[0];

//место, куда пользователь вводит запрос
let searchInput_onFocus = function () {
    document.getElementById('search-form__input_search').style.border = 'none';
};

inputSearch.addEventListener('keypress', function (event) {
   if (event.key === 'Enter') {
       window.location.href = `http://${window.location.host}/search.html?text=${event.value}`;
   }
});

// check if it is first login at current day
debugger
if(new Date().getDate() !== parseInt(localStorage.getItem('lastSignIn'))) {
    showSearch();
    localStorage.setItem("lastSignIn", new Date().getDate());
}

const onClick = (event) => {
    if (event.target.className === "head-1__search" || event.target.className === "head__search" 
    || event.target.classList.contains('search-form__input_search')) {
        showSearch();
    } else if (search_blcok.classList.contains('search_show') && !event.target.classList.contains('search') 
    && !event.target.classList.contains('logo') && event.target.nodeName !== 'INPUT') {
        hideSeacrh();
    }
};

function showSearch() {
    search_blcok.classList.remove('search_hidden');
    search_blcok.classList.add('search_show');
    movie_collection.classList.add('black_background');
}

function hideSeacrh() {
    search_blcok.classList.add('search_hidden');
    search_blcok.classList.remove('search_show');
    movie_collection.classList.remove('black_background');
}

if(search_blcok !== null) {
    document.addEventListener("click", onClick);
}