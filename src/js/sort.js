
/*jshint esversion: 6 */


//находтим и подготавливаем шаблон карточки фильма для дальнейшей работы
const card = document.getElementById('movie-card').textContent.trim();

//компилируем наш шаблон в метод с помощью Lodash для дальгейшего использования, где либо
const compiledCard = _.template(card);




// метод, который будет выполнен в случае удачного обращения к API MovieDB
var successGetUpcomming = function successGetUpcomming(res) {

    // парсим JSON в объект
    var data = JSON.parse(res);


    // выводим его в консоль что бы было наглядно
    console.log('get movie list on search');
    console.log(data);
    console.log('////////////////////');

    // // var sortByName = document.getElementById("byName");
    // // let compareName = function (a, b) {
    // //     if (a.title < b.title)
    // //         return -1;
    // //     if (a.title > b.title)
    // //         return 1;
    // //     return 0;
    // // }
    // // sortByName.addEventListener('click', compareName);
    // // data.results.sort(compareName);

    // var sortByDate = document.getElementById("byDate");
    // let compareDate = function (a, b) {
    //     if (a.release_date > b.release_date)
    //         return -1;
    //     if (a.release_date < b.release_date)
    //         return 1;
    //     return 0;
    // }
    // sortByDate.addEventListener('click', compareDate);
    // data.results.sort(compareDate);



    //проходимся по коллекции фильмов из ответа и обьект каждого из фильмов 
    //передаем в ранее "скомпилированный" метод
    data.results.forEach(item => {
        // console.log(item);
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard({
            item
        }));
    });



};


// Метод, который будет вызван в случае ошибки при обращении к API MovieDB 

var errorGetUpcomming = function errorGetUpcomming() {
    console.log(arguments);
};


//обращение к методу библиотеки для получения списка предстоящих премьер
//данный метод приведен в качестве примера использования шаблона карточки фильма.
//За более детальной информацией обратитесь к документации библиотеки

if(window.location.pathname == '/sort.html')
theMovieDb.movies.getUpcoming({
    "language": "ru-RUS"
}, successGetUpcomming, errorGetUpcomming);
