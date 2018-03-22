
/*jshint esversion: 6 */



//кнопка сортировки по ИД
const sortButtonId = document.getElementById('sortId');

//кнопка сортировки по имени
const sortButtonName = document.getElementById('sortName');

//блок в который вставляем результат
const colectionWrapper = document.getElementById('sortedMovie');

var sortResult


// метод для сортировки от меньшего к большему
function sortASC (data, param) {
    return data.sort((a, b) => a[param] > b[param])
}

// метод для сортировки от большего к меньшему
function sortDESC (data, param) {
    return data.sort((a, b) => b[param] > a[param])
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
    const ordered = order === 'ASC' ? sortASC(sortResult, param) : sortDESC(sortResult, param);

    //выводим отсортированый массив.
 //   renderResult(ordered);
}


// метод, который будет выполнен в случае удачного обращения к API MovieDB
var successGetUpcomming = function successGetUpcomming(res) {

    // парсим JSON в объект
    var data = JSON.parse(res);

    sortResult = data;

    renderResult(data);
};

function renderResult(data){

    //проходимся по коллекции фильмов из ответа и обьект каждого из фильмов 
    //передаем в ранее "скомпилированный" метод
    colectionWrapper.innerHTML = '';
    data.results.forEach(item => {
        
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard({
            item
        }));
    });
}


// Метод, который будет вызван в случае ошибки при обращении к API MovieDB 

var errorGetUpcomming = function errorGetUpcomming() {
    console.log(arguments);
};


//обращение к методу библиотеки для получения списка предстоящих премьер
//данный метод приведен в качестве примера использования шаблона карточки фильма.
//За более детальной информацией обратитесь к документации библиотеки

if(window.location.pathname == '/sort.html'){

    theMovieDb.movies.getUpcoming({
        "language": "ru-RUS"
    }, successGetUpcomming, errorGetUpcomming);

    sortButtonName.onclick = sort;

}
