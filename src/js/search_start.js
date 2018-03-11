if(window.location.pathname == '/'){

let movie_collection = document.getElementById('searchMovie');
// getElementById вохвращает массивоподобный объект
// даже если DOM елемент на старнице один.
let search_blcok = Array.from(document.getElementsByClassName('search'));
search_blcok = search_blcok[0]; 
//место, куда пользователь вводит запрос
let searchInput_onFocus = function (){
    document.getElementById('search-form_input_search').style.border = 'none';
}

const onClick = (event) => {
    if (event.target.className === "Some Future Class") {
        search_blcok.classList.remove('search_hidden');
        movie_collection.classList.add('bg');
    }
    if (event.target.className !== "search" && !search_blcok.classList.contains('search_hidden')) {
        console.dir(search_blcok);
        search_blcok.classList.add('search_hidden');
    }
}

document.addEventListener("click", onClick);

}