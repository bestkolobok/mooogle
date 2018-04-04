
/*jshint esversion: 6 */
const sortButtonDate = document.getElementById('sortByDate');
const sortButtonName = document.getElementById('sortName');
const colectionWrapper = document.getElementById('sortedMovie');
const sortTitle = document.getElementById('sort-title');

var sortResult = {
    results: []
};


// метод для сортировки от меньшего к большему
function sortASC (data, param) {
    //return data.sort((a, b) => a[param] > b[param])
    return data.sort((a, b) => a[param].localeCompare(b[param]));
}

// метод для сортировки от большего к меньшему
function sortDESC (data, param) {
    //return data.sort((a, b) => b[param] > a[param])
    return data.sort((a, b) =>b[param].localeCompare(a[param]));
}


// метод, который будет повешен на событие onclick всех кнопок сортировки
function sort (event) {

    // определяем по чему был клик
    const button = event.target;

    //определяем из поля data-param описанного на кнопке, по какому параметру будем сортировать
    const param = button.dataset.param;

    //определяем из поля data-order описанного на кнопке, какой порядок сортировки будем использовать
    const order = button.dataset.order;

    //Определяем "направление" сортировки в текущий момент, и записываем в параметр кнопки data-order противоположное значение,
    //что бы при следующем нажатии сортировка сработала в другом "направлении".
    const changedOrder = order === 'ASC' ? 'DESC' : 'ASC';
    button.dataset.order = changedOrder;

    //в зависимости от текущего типа сортировки применяем тот или инной метод
    const ordered = order === 'ASC' ? sortASC(sortResult.results, param) : sortDESC(sortResult.results, param);

    //выводим отсортированый массив.
    renderResult({results: ordered});
}

var successGet = function (res) {

    var data = JSON.parse(res);

    sortResult = data;

    renderResult(data);
};

var successSearch = function (res) {
    var data = JSON.parse(res);
    
    console.log(data);
    if(data.results)
        sortResult.results = [...sortResult.results, ...data.results];

    console.log(sortResult);

    renderResult(data, false);
}

function renderResult(data, clean = true){

    //проходимся по коллекции фильмов из ответа и обьект каждого из фильмов 
    //передаем в ранее "скомпилированный" метод
    if(clean)
        colectionWrapper.innerHTML = '';


    data.results.forEach(item => {

        if(Object.getOwnPropertyNames(item).includes('name')){
            item.title = item.name;
        }

        if(Object.getOwnPropertyNames(item).includes('first_air_date')){
            item.release_date = item.first_air_date
        }
      
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard({
            item
        }));
    });
}


// Метод, который будет вызван в случае ошибки при обращении к API MovieDB 

var errorGet = function errorGet() {
    console.log(arguments);
};


if(window.location.pathname == '/sort.html'){

    var params = getUrlParams();
    var page = Object.getOwnPropertyNames(params).includes('page') ? params.page : 2;

    if(Object.getOwnPropertyNames(params).includes('q')){

        sortTitle.innerText = 'Результат поиска';
        theMovieDb.search.getMovie({"query":params.q,"language": "ru-RUS"}, successSearch, errorGet);
        theMovieDb.search.getTv({"query":params.q,"language": "ru-RUS"}, successSearch, errorGet);
    }

    if(Object.getOwnPropertyNames(params).includes('p')){


        switch (params.p){
            case 'getUpcoming':
                sortTitle.innerText = 'Премьеры';
                theMovieDb.movies.getUpcoming({
                    "language": "ru-RUS",
                    "page" : page,
                }, successGet, errorGet);
            break;
    
            case 'getTopRated':
                sortTitle.innerText = 'Самые рейтинговые';
                theMovieDb.movies.getTopRated({ 
                    "language": "ru-RUS",
                    "page" : page,
                }, successGet, errorGet);
            break;
    
            case 'getNowPlaying':
                sortTitle.innerText = 'Сейчас на экранах';
                theMovieDb.movies.getNowPlaying({ 
                    "language": "ru-RUS",
                    "page" : page,
                }, successGet, errorGet);
            break;
    
            case 'getOnTheAirTV':
                sortTitle.innerText = 'Сериалы в эфире';  
                theMovieDb.tv.getOnTheAir({ 
                    "language": "ru-RUS",
                    "page" : page,
                }, successGet, errorGet);
            break;
    
            case 'getTopRatedTV':
                sortTitle.innerText = 'Сериалы самые рейтинговые';
                theMovieDb.tv.getTopRated({ 
                    "language": "ru-RUS",
                    "page" : page,
                }, successGet, errorGet);
            break;
        }


        
    }

    sortButtonName.onclick = sort;
    sortButtonDate.onclick = sort;
}

function getUrlParams () {

    var params = {};
    var locationParams = window.location.search.replace('?', '').split('&');

    locationParams.forEach((item)=>{
        var a = item.split('=');
        params[a[0]] = a[1];
    })

    return params;
}
