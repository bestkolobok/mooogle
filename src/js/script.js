<<<<<<< HEAD
<<<<<<< HEAD
const trailer = document.querySelector(".trailer-video");
const reviews = [];
const reviewContainer = document.querySelector("#reviews-container");
const trailerHidden = document.querySelector(".trailer");

let successGetTrailer = function (res) {
    const result = JSON.parse(res);
    console.log(result);
    if (result.youtube.length === 0) {
        trailerHidden.setAttribute("style", "display: none;");
    } else {
        trailer.setAttribute("src", `https://www.youtube.com/embed/${result.youtube[0].source}`);
    }
}

let errorGetTrailer = function (res) {
    console.log(arguments);
}

let successGetReview = function (res) {
    const result = JSON.parse(res);
    console.log(result);
    let reviewInfo = {};
    for (let i = 0; i < result.results.length; i++) {
        reviewInfo.author = result.results[i].author;
        reviewInfo.content = result.results[i].content;
        reviews.push(reviewInfo);
        reviewInfo = {};
    }
    console.log(reviews);
    const html = document.querySelector('#reviews-main').textContent.trim();
    const compiled = _.template(html);
    const r = compiled(reviews);
    reviewContainer.innerHTML = r;


    let posts = document.querySelectorAll(".big-post");
    console.log(posts);
    posts.forEach(item => {
        let onClick = event => {
            if (event.target !== event.currentTarget) {
                if (item.classList.contains("reviews-text-big")) {
                    item.classList.remove("reviews-text-big");
                    item.classList.add("reviews-text");
                    item.innerHTML = `${reviews[0].content.slice(0, 152)}...<a class="more-info"><span>еще</span></a>`;
                } else {
                    item.classList.add("reviews-text-big");
                    item.classList.remove("reviews-text");
                    item.innerHTML = `${reviews[0].content}<a class="more-info"><span>свернуть</span></a>`;
                }
            }
        };
        item.addEventListener("click", onClick);
    });
}

let errorGetReview = function (res) {
    console.log(arguments);
}

theMovieDb.movies.getTrailers({ "id": 76203, "language": "ru-RUS" }, successGetTrailer, errorGetTrailer);
theMovieDb.movies.getReviews({ "id": 76203 }, successGetReview, errorGetReview);



=======
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
>>>>>>> 6caf97a9ace9ed0ebea0ff9b59add18aaa72f7ac
=======

window.addEventListener("click", function(e){

    if(e.target.classList.contains('movie-card__title')){
        this.location.replace('/movie.html');
    }
})
>>>>>>> 86a8a41ec13f69529102dbd99602be2d321578ce
