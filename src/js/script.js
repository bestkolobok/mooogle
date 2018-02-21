var lis = document.getElementsByTagName('li');
var img = document.querySelector('.main_img');
var description = document.querySelector('.text_description')
var date = document.querySelector('.time_item')
var title = document.querySelector('.title')

for (var i = 0; i < lis.length; i++) {
  lis[i].style.position = 'relative';
  var span = document.createElement('span');
  span.style.cssText = 'position:absolute;left:0;top:0';
  span.innerHTML = i + 1;
  lis[i].appendChild(span);
}

var width = 88; 
var count = 1; 

var carousel = document.getElementById('carousel');
var list = carousel.querySelector('ul');
var listElems = carousel.querySelectorAll('li');

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
  position = Math.max(position - width * count, -width * (listElems.length - count*4));
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

let successPeopleCB = function(res) {
  const result = JSON.parse(res);
  console.log(result);
}

let errorPeopleCB = function(){
  console.log(arguments);
}

theMovieDb.movies.getById({"id":76203, "language":"ru-RUS" }, successCB, errorCB)

theMovieDb.movies.getTrailers({"id":76203, "language":"ru-RUS" }, successPeopleCB, errorPeopleCB)
