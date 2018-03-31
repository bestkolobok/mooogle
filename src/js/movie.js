if(window.location.pathname == '/movie.html'){

var img = document.querySelector('.card__img');
var description = document.querySelector('.description__text');
var date = document.querySelector('.links__time--item');
var title = document.querySelector('.card__about--title');
var container = document.querySelector('.images');
var tableCountry = document.querySelector(".table-country");
var tableTagline = document.querySelector(".table-tagline");
var tableFilmtype = document.querySelector(".table-filmtype");
var tableRuntime = document.querySelector(".table-runtime");
var tableProducer = document.querySelector(".table-producer");
var tableFilmContent = document.querySelector(".table-filmcontent");
var partSlide = document.querySelectorAll(".part-slide");
var arrowLeft = document.querySelector(".arrow-left");
var arrowRight = document.querySelector(".arrow-right");
var ulSlider = document.querySelector(".part-slider");
var arrowLeftActors = document.querySelector(".arrow-left__actors");
var arrowRightActors = document.querySelector(".arrow-right__actors");





var width = 80; 
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
    // console.log(result);
  img.style.backgroundImage = `url('https://image.tmdb.org/t/p/w600_and_h900_bestv2/${result.poster_path}')`;
  description.textContent = result.overview;
  date.textContent = result.release_date;
  title.innerHTML = result.title;
  tableCountry.textContent = `${result.production_countries[0].iso_3166_1}, ${result.production_countries[0].name}`;
  tableTagline.textContent = result.tagline;
  for(let i = 0; i < result.genres.length; i++){
    tableFilmtype.textContent += `${result.genres[i].name}, `;
  }
  tableRuntime.textContent = `${result.runtime} мин`;
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
  // console.log(result);
  tableProducer.textContent = result.crew[1].name;
  tableFilmContent.textContent = result.crew[0].name;
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


theMovieDb.movies.getById({"id":269149, "language":"ru-RUS" }, successCB, errorCB);

theMovieDb.credits.getCredit({"id":269149, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB);

theMovieDb.movies.getImages({"id":269149}, successPeopleImagesCB, errorPeopleImagesCB)

const trailer = document.querySelector(".trailer-video");
var reviews = [];
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

theMovieDb.movies.getTrailers({ "id": 269149, "language": "ru-RUS" }, successGetTrailer, errorGetTrailer);
theMovieDb.movies.getReviews({ "id": 269149 }, successGetReview, errorGetReview);



}
