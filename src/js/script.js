var img = document.querySelector('.main_img');
var description = document.querySelector('.text_description')
var date = document.querySelector('.time_item')
var title = document.querySelector('.title')
var container = document.querySelector('.images');


var width = 88; 
var count = 1; 
var index = 0;


var carousel = document.getElementById('carousel');
var list = carousel.querySelector('.images');


// var infinitecarousel = new InfiniteCarousel('.images', 'horizontal', 3, {
//     timerDuration: 2000,
//     transitionDuration: '1s'
//   });
  

var position = 0; 







let successCB = function(res) {
  const result = JSON.parse(res);
  console.log(result);
  img.style.backgroundImage = `url('https://image.tmdb.org/t/p/w600_and_h900_bestv2/${result.poster_path}')`;
  description.textContent = result.overview;
  date.textContent = result.release_date;
  title.textContent = result.title;
}

let errorCB = function() {
  console.log(arguments);

}

var galleryItems = {
  text: [],
  img: [],
}


let successPeopleCB = function(res) {
  const result = JSON.parse(res);
  console.log(result);
  for (let i = 0; i < 10; i++){
    galleryItems.text.push(result.cast[i].name);
    galleryItems.img.push(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.cast[i].profile_path}`);
  }
  const html = document.querySelector('#gallery-item').textContent.trim();
  const compiled = _.template(html);
  
  var resultCompiled = compiled(galleryItems);
  
  container.innerHTML = resultCompiled;

  var listElems = carousel.querySelectorAll('.images_item');


  var initialPoint;
  var finalPoint;

  list.addEventListener('touchstart', function(event) {
  event.preventDefault();
  event.stopPropagation();
  initialPoint=event.changedTouches[0];
    for(let i = 0; i < listElems.length; i++){
      var clone = listElems[i].cloneNode(true);
      list.appendChild(clone);

    }

  }, false);

  list.addEventListener('touchend', function(event) {
  event.preventDefault();
  event.stopPropagation();
  finalPoint=event.changedTouches[0];

    // for(let i = 0; i < listElems.length; i++){
    //   var clone = listElems[i].cloneNode(true);
    //   list.insertBefore(clone, listElems[i]);

    // }

    index++;

  var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
  if (xAbs > 20) {
    console.log(listElems.length+index);
    if (finalPoint.pageX < initialPoint.pageX){
      position = Math.max(position - width * count, -width * ((listElems.length + index) - count*4));
      list.style.marginLeft = position + 'px';
    } else{
      position = Math.min(position + width * count, 0)
      list.style.marginLeft = position + 'px';}
    }
  }, false);
  
  
}

let errorPeopleCB = function(){
  console.log(arguments);
}


theMovieDb.movies.getById({"id":284054, "language":"ru-RUS" }, successCB, errorCB)

theMovieDb.credits.getCredit({"id":284054, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB)





const trailer = document.querySelector(".trailer-video");
/* const review = document.querySelector(".review");
const userName = document.querySelector(".userName"); */
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



