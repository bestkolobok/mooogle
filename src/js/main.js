/*jshint esversion: 6 */


//находтим и подготавливаем шаблон карточки фильма для дальнейшей работы
const premieresFilm = document.getElementById('premieresFilm').textContent.trim();
const screenFilm = document.getElementById('screenFilm').textContent.trim();
const top100Film = document.getElementById('top100Film').textContent.trim();
const premieresSeries = document.getElementById('premieresSeries').textContent.trim();
const screenSeries = document.getElementById('screenSeries').textContent.trim();
const top100Series = document.getElementById('top100Series').textContent.trim();
const compiledPremieresFilm = _.template(premieresFilm);
const compiledScreenFilm = _.template(screenFilm);
const compiledTop100Film = _.template(top100Film);
const compiledPremieresSeries = _.template(premieresSeries);
const compiledScreenSeries = _.template(screenSeries);
const compiledTop100Series = _.template(top100Series);
const colectionWrapper = document.getElementById('searchMovie');
var successGetUpcomming = function (res) {
    var data = JSON.parse(res);
        console.log(data);
    colectionWrapper.innerHTML += compiledPremieresFilm({data})
};
var successgetNowPlaying = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledScreenFilm({data})
};
var successgetTopRated = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledTop100Film({data})
};
var successgetOnTheAir = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledPremieresSeries({data})
};
var successgetAiringToday = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledScreenSeries({data})
};
var successgetTopRated = function (res) {
    var data = JSON.parse(res);
    colectionWrapper.innerHTML += compiledTop100Series({data})
};
var error = function () {
    console.log(arguments);
};

theMovieDb.movies.getUpcoming({ "language": "ru-RUS"  }, successGetUpcomming, error);
theMovieDb.movies.getNowPlaying({ "language": "ru-RUS"  }, successgetNowPlaying, error);
theMovieDb.movies.getTopRated({ "language": "ru-RUS"  }, successgetTopRated, error);
theMovieDb.tv.getOnTheAir({ "language": "ru-RUS"  }, successgetOnTheAir, error);
theMovieDb.tv.getAiringToday({ "language": "ru-RUS"  }, successgetAiringToday, error);
theMovieDb.tv.getTopRated({ "language": "ru-RUS"  }, successgetTopRated, error);