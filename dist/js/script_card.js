var successGetMoview = function successGetMoview(res) {
    var result = JSON.parse(res);
    console.log('get movie list on search');
    console.log(result);
    console.log('////////////////////');

    const card = document.getElementById('card').textContent.trim();
    const colectionWrapper = document.getElementById('searchMovie');
    const compiledCard = _.template(card);

    result['results'].forEach((movie, i) => {
        result.itemNum = i;
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard(result));
    });
};

var errorGetMovie = function errorGetMovie() {
    console.log(arguments);
};

var successGetUpcomming = function successGetUpcomming(res) {
    var result = JSON.parse(res);
    console.log('get latest movie');
    console.log(result);
    console.log('////////////////////');

    const card = document.getElementById('card').textContent.trim();
    const colectionWrapper = document.getElementById('latestMovie');
    const compiledCard = _.template(card);

    result['results'].forEach((movie, i) => {
        result.itemNum = i;
        colectionWrapper.insertAdjacentHTML('beforeend', compiledCard(result));
    });
};

var errorGetUpcomming = function errorGetUpcomming() {
    console.log(arguments);
};

const searchInput = "Бойцовский клуб";

theMovieDb.search.getMovie({ "query": searchInput, "language": "ru-RUS" }, successGetMoview, errorGetMovie);

theMovieDb.movies.getUpcoming({ "language": "ru-RUS" }, successGetUpcomming, errorGetUpcomming);