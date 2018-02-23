var img = document.querySelector('.main_img');
var description = document.querySelector('.text_description')
var date = document.querySelector('.time_item')
var title = document.querySelector('.title')
var container = document.querySelector('.images');


// for (var i = 0; i < 7; i++) {
//   lis[i].style.position = 'relative';
//   var span = document.createElement('span');
//   span.style.cssText = 'position:absolute;left:1px;top:80px;font-size: 14px; color: #77c1bb; font-family: "Roboto", sans-serif; text-align: center;';
//   lis[i].appendChild(span);
// }

var width = 88; 
var count = 1; 

var carousel = document.getElementById('carousel');
var list = carousel.querySelector('.images');
var listElems = carousel.querySelectorAll('.images_item');

var position = 0; 

var initialPoint;
var finalPoint;
list.addEventListener('touchstart', function(event) {
event.preventDefault();
event.stopPropagation();
initialPoint=event.changedTouches[0];
}, false);
list.addEventListener('touchend', function(event) {
event.preventDefault();
event.stopPropagation();
finalPoint=event.changedTouches[0];

var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
if (xAbs > 20) {
if (finalPoint.pageX < initialPoint.pageX){
  position = Math.max(position - width * count, -width * (7 - count*4));
  list.style.marginLeft = position + 'px';
} else{
  position = Math.min(position + width * count, 0)
  list.style.marginLeft = position + 'px';}
}
}, false);





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
  for (let i = 0; i < 7; i++){
    galleryItems.text.push(result.cast[i].name);
    galleryItems.img.push(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${result.cast[i].profile_path}`);
  }
  const html = document.querySelector('#gallery-item').textContent.trim();
  const compiled = _.template(html);
  
  var resultCompiled = compiled(galleryItems);
  
  container.innerHTML = resultCompiled;
}

let errorPeopleCB = function(){
  console.log(arguments);
}


theMovieDb.movies.getById({"id":76203, "language":"ru-RUS" }, successCB, errorCB)

theMovieDb.credits.getCredit({"id":76203, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB)




