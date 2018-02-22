var sortByNameBtnUp = document.getElementById('sortByNameUp');
var sortByNameBtnDown = document.getElementById('sortByNameDown');
var sortByDateBtnUp = document.getElementById('sortByDateUp');
var sortByDateBtnDown = document.getElementById('sortByDateDown');

function sortingByNameUp() {
// как сортируем пока непонятно, что сюда заходит
}

function sortingByNameDown() {
}

function sortingByDateUp() {
}

function sortingByDateDown() {
}

sortByNameBtnUp.addEventListener('click', sortingByNameUp); //вешаем датчик "слушателя" клика на стрелочки
sortByNameBtnDown.addEventListener('click', sortingByNameDown);
sortByDateBtnUp.addEventListener('click', sortingByDateUp);
sortByDateBtnDown.addEventListener('click', sortingByDateDown);