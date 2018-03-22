

var error = function () {
    console.log(arguments);
};

const upcommingFilmWrapper = document.getElementById('upcoming_film');
const TopFilmWrapper = document.getElementById('top_rated_film');
const PlayingFilmWrapper = document.getElementById('now_playing_film');
const upcommingSeriesWrapper = document.getElementById('upcoming_series');
const TopSeriesWrapper = document.getElementById('top_rated_series');
const PlayingSeriesWrapper = document.getElementById('now_playing_series');


//проверки на нулл не убирать, они нужны если страница отличная от стартовой,
//что бы не выпадали при отсутсвии блоков


if(upcommingFilmWrapper !== null)
    theMovieDb.movies.getUpcoming({ "language": "ru-RUS"  },  upcommingFilm, error);
    
if(PlayingFilmWrapper !== null)
    theMovieDb.movies.getNowPlaying({ "language": "ru-RUS"  }, PlayingFilm, error);
    
if(TopFilmWrapper !== null)
    theMovieDb.movies.getTopRated({ "language": "ru-RUS"  }, TopFilm, error);

if(upcommingSeriesWrapper !== null)
    theMovieDb.tv.getOnTheAir({ "language": "ru-RUS"  }, upcommingSeries, error);

if(PlayingSeriesWrapper !== null)
    theMovieDb.tv.getAiringToday({ "language": "ru-RUS"  }, PlayingSeries, error);

if(TopSeriesWrapper !== null)
    theMovieDb.tv.getTopRated({ "language": "ru-RUS"  }, TopSeries, error);

function prepareResult (res, count) {

    const data = JSON.parse(res);
    return data.results.splice(0, count);
}

function upcommingFilm (res){

    const toShow = prepareResult(res, 4);
  
    toShow.forEach((item, i) => {
        upcommingFilmWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function TopFilm (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        TopFilmWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function PlayingFilm (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        PlayingFilmWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function upcommingSeries (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        upcommingSeriesWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function TopSeries (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        TopSeriesWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function PlayingSeries (res){

    const toShow = prepareResult(res, 4);

    toShow.forEach((item, i) => {
        PlayingSeriesWrapper.insertAdjacentHTML('beforeend', compiledCard({item}));
    });
}

function openCaption(evt, caption) {
    var i, moviesWrapper, tabLinks;

    moviesWrapper = document.getElementsByClassName("movies-wrapper");
    for (i = 0; i < moviesWrapper.length; i++) {
        moviesWrapper[i].style.display = "none";
    }

    tabLinks = document.getElementsByClassName("tab_links");

    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace("active", "");

    }

    document.getElementById(caption).style.display = "block";
    evt.currentTarget.className += " active";
}


