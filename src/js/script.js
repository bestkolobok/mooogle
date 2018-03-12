
window.addEventListener("click", function(e){

    if(e.target.classList.contains('movie-card__title')){
        this.location.replace('/movie.html');
    }
})


