/*jshint esversion: 6 */


//находтим и подготавливаем шаблон карточки фильма для дальнейшей работы
const card = document.getElementById('movie-card').textContent.trim();

//компилируем наш шаблон в метод с помощью Lodash для дальгейшего использования, где либо
const compiledCard = _.template(card);

//Находим место, куда мы будет вставлять карточки фильмов.
const colectionWrapper = document.getElementById('searchMovie');
        

// метод, который будет выполнен в случае удачного обращения к API MovieDB
var successGetUpcomming = function successGetUpcomming(res) {
    
    // парсим JSON в объект
    var data = JSON.parse(res);


    // выводим его в консоль что бы было наглядно
    console.log('get movie list on search');
    console.log(data);
    console.log('////////////////////');


    //проходимся по коллекции фильмов из ответа и обьект каждого из фильмов 
    //передаем в ранее "скомпилированный" метод
    data.results.forEach(item => {
        console.log(item);
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
};

// Метод, который будет вызван в случае ошибки при обращении к API MovieDB 

var errorGetUpcomming = function errorGetUpcomming() {
    console.log(arguments);
};


//обращение к методу библиотеки для получения списка предстоящих премьер
//данный метод приведен в качестве примера использования шаблона карточки фильма.
//За более детальной информацией обратитесь к документации библиотеки
theMovieDb.movies.getUpcoming({ "language": "ru-RUS" }, successGetUpcomming, errorGetUpcomming);

