if(window.location.pathname == '/movie.html'){

//-----------------------------------------------------top-start--------------------------------------------------------


//Vars
const IMAGES_IN_SLIDER = document.querySelector('.card__img');
const MAIN_DESCRIPTION_IN_MOVIEPAGE = document.querySelector('.description__text');
const DATE_IN_MOVIEPAGE = document.querySelector('.links__time--item');
const MAIN_TITLE_IN_MOVIEPAGE = document.querySelector('.card__about--title');
const CONTAINER_OF_SLIDER_ACTORS = document.querySelector('.images');
const COUNTRY_NAME_IN_MAIN_TABLE = document.querySelector(".table-country");
const TAG_LINE_IN_MAIN_TABLE = document.querySelector(".table-tagline");
const FILM_TYPE_IN_MAIN_TABLE = document.querySelector(".table-filmtype");
const RUN_TIME_IN_MAIN_TABLE = document.querySelector(".table-runtime");
const PRODUCER_NAME_IN_MAIN_TABLE = document.querySelector(".table-producer");
const ARTDIRECTOR_NAME_IN_MAIN_TABLE = document.querySelector(".table-filmcontent");
var partSlide = document.querySelectorAll(".part-slide");
var arrowLeft = document.querySelector(".arrow-left");
var arrowRight = document.querySelector(".arrow-right");
var ulSlider = document.querySelector(".part-slider");
var arrowLeftActors = document.querySelector(".arrow-left__actors");
var arrowRightActors = document.querySelector(".arrow-right__actors");

// Parse url
var params = getUrlParams();

//Slider
var width = 80; 
var count = 1; 
var index = 0;
var carousel = document.getElementById('carousel');
var list = carousel.querySelector('.images');
var position = 0; 

// Render slider
var galleryItems = {
  text: [],
  img: [],
}
  
// Description
  
  let successCB = function(res) {
    const result = JSON.parse(res);
    if(params.type === 'movie'){
      DATE_IN_MOVIEPAGE.textContent = result.release_date;
      MAIN_TITLE_IN_MOVIEPAGE.innerHTML = result.title;
      RUN_TIME_IN_MAIN_TABLE.textContent = `${result.runtime} мин`;
      COUNTRY_NAME_IN_MAIN_TABLE.textContent = `${result.production_countries[0].iso_3166_1}, ${result.production_countries[0].name}`;
      TAG_LINE_IN_MAIN_TABLE.textContent = result.tagline;
    } else {
      DATE_IN_MOVIEPAGE.textContent = result.last_air_date;
      MAIN_TITLE_IN_MOVIEPAGE.innerHTML = result.name;
      RUN_TIME_IN_MAIN_TABLE.textContent = `${result.episode_run_time[0]} мин`;
      COUNTRY_NAME_IN_MAIN_TABLE.textContent = `${result.origin_country[0]}`;
      TAG_LINE_IN_MAIN_TABLE.textContent = result.original_name;
    }
    console.log(result);
  IMAGES_IN_SLIDER.style.backgroundImage = `url('https://image.tmdb.org/t/p/w600_and_h900_bestv2/${result.poster_path}')`;
  for(let i = 0; i < result.genres.length; i++){
    FILM_TYPE_IN_MAIN_TABLE.textContent += `${result.genres[i].name}, `;
  }
  MAIN_DESCRIPTION_IN_MOVIEPAGE.textContent = result.overview;
  
}

let errorCB = function() {
  console.log(arguments);

}

// Actors slider

let successPeopleCB = function(res) {
  const result = JSON.parse(res);
  console.log(result);
  PRODUCER_NAME_IN_MAIN_TABLE.textContent = result.crew[1].name;
  ARTDIRECTOR_NAME_IN_MAIN_TABLE.textContent = result.crew[0].name;
  for (let i = 0; i < 8; i++){
    galleryItems.text.push(result.cast[i].name);
    galleryItems.img.push(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.cast[i].profile_path}`);
  }
  const html = document.querySelector('#gallery-item').textContent.trim();
  const compiled = _.template(html);
  
  var resultCompiled = compiled(galleryItems);
  
  CONTAINER_OF_SLIDER_ACTORS.innerHTML = resultCompiled;

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
  
  arrowLeftActors.addEventListener("click", function(){
    position = Math.min(position + width * count, 0)
    list.style.marginLeft = position + 'px';
  });
  arrowRightActors.addEventListener("click", function(){
    position = Math.max(position - width * count, -width * (8 - count*4));
    list.style.marginLeft = position + 'px';
  });
  
}

let errorPeopleCB = function(){
  console.log(arguments);
}

var countPart = 1;
var positionPart = 0; 
 

// Backdrops images

let successPeopleImagesCB = function(res){
  const result = JSON.parse(res);
  console.log(result);
  let widthPart = 130;
  for(let i = 0; i < partSlide.length; i++){
    partSlide[i].style.backgroundImage = `url("https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.backdrops[i].file_path}")`
  };
  arrowLeft.addEventListener("click", function(){
    positionPart = Math.min(positionPart + widthPart * countPart, 0)
    ulSlider.style.marginLeft = positionPart + 'px';
  });
  arrowRight.addEventListener("click", function(){
    positionPart = Math.max(positionPart - widthPart * countPart, -widthPart * (8 - countPart*4));
    ulSlider.style.marginLeft = positionPart + 'px';
  });
}

let errorPeopleImagesCB = function(){
  console.log(arguments);
}

//--------------------------------------------------------------top-end---------------------------------------------------------------

const trailer = document.querySelector(".trailer-video");
var reviews = [];
const reviewContainer = document.querySelector("#reviews-container");
const trailerHidden = document.querySelector(".trailer");

let successGetTrailer = function (res) {
    const result = JSON.parse(res);
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
    let reviewInfo = {};
    for (let i = 0; i < result.results.length; i++) {
        reviewInfo.author = result.results[i].author;
        reviewInfo.content = result.results[i].content;
        reviews.push(reviewInfo);
        reviewInfo = {};
    }
    const html = document.querySelector('#reviews-main').textContent.trim();
    const compiled = _.template(html);
    const r = compiled(reviews);
    reviewContainer.innerHTML = r;


    let posts = document.querySelectorAll(".big-post");
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

if(params.type === 'movie'){
  theMovieDb.movies.getById({"id":params.id, "language":"ru-RUS" }, successCB, errorCB);
  theMovieDb.credits.getCredit({"id":params.id, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB);
  theMovieDb.movies.getImages({"id":params.id}, successPeopleImagesCB, errorPeopleImagesCB)
  theMovieDb.movies.getTrailers({ "id": params.id, "language": "ru-RUS" }, successGetTrailer, errorGetTrailer);
  theMovieDb.movies.getReviews({ "id": params.id }, successGetReview, errorGetReview);
} else {
  theMovieDb.tv.getById({"id":params.id, "language":"ru-RUS" }, successCB, errorCB);
  theMovieDb.tv.getCredits({"id":params.id, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB);
  theMovieDb.tv.getImages({"id":params.id}, successPeopleImagesCB, errorPeopleImagesCB)
  theMovieDb.tv.getTrailers({ "id": params.id, "language": "ru-RUS" }, successGetTrailer, errorGetTrailer);
  theMovieDb.tv.getReviews({ "id": params.id }, successGetReview, errorGetReview);
}




}
