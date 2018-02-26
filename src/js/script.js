const trailer = document.querySelector(".trailer-video");
const review = document.querySelector(".review");
const userName = document.querySelector(".userName");
const reviews = [];
const reviewContainer = document.querySelector("#reviews-container");

let successGetTrailer = function (res) {
    const result = JSON.parse(res);
    console.log(result);
    trailer.setAttribute("src", `https://www.youtube.com/embed/${result.youtube[0].source}`);
}

let errorGetTrailer = function (res) {
    console.log(arguments);
}

let successGetReview = function (res) {
    const result = JSON.parse(res);
    console.log(result);
    console.log(result.results);
    let reviewInfo = {};
    for (let i = 0; i < result.results.length; i++) {
        reviewInfo.author = result.results[i].author;
        reviewInfo.content = result.results[i].content;
        console.log(reviewInfo);
        reviews.push(reviewInfo);
        reviewInfo = {};
    }
    console.log(reviews);
    const html = document.querySelector('#reviews-main').textContent.trim();
    const compiled = _.template(html);
    const r = compiled(reviews);
    console.log(r);
    reviewContainer.innerHTML = r;
}

let errorGetReview = function (res) {
    console.log(arguments);
}

theMovieDb.movies.getTrailers({ "id": 76203, "language": "ru-RUS" }, successGetTrailer, errorGetTrailer);
theMovieDb.movies.getReviews({ "id": 76203 }, successGetReview, errorGetReview);



