
const successGetMoview = function(res){
    const result = JSON.parse(res);
    console.log('get movie list on search');
    console.log(result);
    console.log('////////////////////')
}

const errorGetMovie = function(){
    console.log(arguments);
}

const successGetUpcomming = function(res){
    const result = JSON.parse(res);
    console.log('get latest movie');
    console.log(result);
    console.log('////////////////////')
}

const errorGetUpcomming = function(){
    console.log(arguments);
}

theMovieDb.search.getMovie({"query":"Бойцовский%20клуб", "language":"ru-RUS"}, successGetMoview, errorGetMovie)



theMovieDb.movies.getUpcoming({"language":"ru-RUS"}, successGetUpcomming, errorGetUpcomming)


