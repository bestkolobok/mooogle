'use strict';

var lis = document.getElementsByTagName('li');
for (var i = 0; i < lis.length; i++) {
  lis[i].style.position = 'relative';
  var span = document.createElement('span');
  span.style.cssText = 'position:absolute;left:0;top:0';
  span.innerHTML = i + 1;
  lis[i].appendChild(span);
}

var width = 96;
var count = 1;

var carousel = document.getElementById('carousel');
var list = carousel.querySelector('ul');
var listElems = carousel.querySelectorAll('li');

var position = 0;

var initialPoint;
var finalPoint;
list.addEventListener('touchstart', function (event) {
  event.preventDefault();
  event.stopPropagation();
  initialPoint = event.changedTouches[0];
}, false);
list.addEventListener('touchend', function (event) {
  event.preventDefault();
  event.stopPropagation();
  finalPoint = event.changedTouches[0];

  var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
  if (xAbs > 20) {
    if (finalPoint.pageX < initialPoint.pageX) {
      position = Math.max(position - width * count, -width * (listElems.length - count * 3));
      list.style.marginLeft = position + 'px';
    } else {
      position = Math.min(position + width * count, 0);
      list.style.marginLeft = position + 'px';
    }
  }
}, false);